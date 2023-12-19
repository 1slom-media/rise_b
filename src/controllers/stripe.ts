import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from 'dotenv'
import { AppDataSource } from "../data-source";
import { CartEntity } from "../entities/cart";
import { OrdersEntity } from "../entities/order";
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

class StripeController {

    public async Post(req: Request, res: Response) {
        try {
            const { user, punkt, phone } = req.body
            const carts = await AppDataSource.getRepository(CartEntity).find({
                relations: [
                    'products', 'products.parametrs', 'products.brand', 'user'
                ]
            })
            const cartFilter = carts.filter(cart => cart.user.id === +user);
            const truncatedCart = cartFilter.map((cart) => {
                return {
                    id: cart.id,
                    quantity: cart.quantity,
                    price: cart.price,
                    products: cart.products.id,
                    company: cart.company,
                };
            });

            const customer = await stripe.customers.create({
                metadata: {
                    user: user,
                    cart: JSON.stringify(truncatedCart),
                    phone: phone,
                    punkt: punkt
                },
            });

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: cartFilter.map((cart: any) => {
                    return {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: cart.products.name_uz,
                                description: cart.products.description_uz,
                                metadata: {
                                    id: cart.id,
                                },
                            },
                            unit_amount: +cart.price * 100,
                        },
                        quantity: cart.quantity,
                    }
                }),
                customer: customer.id,
                success_url: "http://127.0.0.1:5173/success",
                cancel_url: "http://127.0.0.1:5173/cancel",
            });

            res.json({ url: session.url });
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    }


}

// Create order function
const createOrder = async (customer, data) => {
    try {
        // console.log(data);
        const user = customer.metadata.user;
        const phone = customer.metadata.phone;
        const punkt = customer.metadata.punkt;
        console.log(customer.metadata);

        const carts = await AppDataSource.getRepository(CartEntity).find({
            relations: [
                'products', 'products.parametrs', 'products.brand', 'user'
            ]
        })
        const cartFilter = carts.filter(cart => cart.user.id === +user);

        for (const cart of cartFilter) {
            const order = new OrdersEntity()
            order.quantity = cart.quantity
            order.price = cart.price
            order.products = cart.products
            order.punkt = punkt
            order.phone = phone
            order.user = user
            order.indeks = cart.indeks
            order.company = cart.company
            await AppDataSource.manager.save(order)
        }
        console.log("Processed Order: Yaratildi");
    } catch (err) {
        console.log(err);
    }
};

// Stripe webhoook
export const webhookRouter = async (req: Request, res: Response) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret;
    // webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        const sig = req.headers['stripe-signature'];

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                webhookSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed:  ${err}`);
            return res.sendStatus(400);
        }
        // Extract the object from the event.
        data = event.data.object;
        eventType = event.type;
    } else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // retrieve the event data directly from the request body.
        data = req.body.data.object;
        eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
        stripe.customers
            .retrieve(data.customer)
            .then(async (customer) => {
                try {
                    // CREATE ORDER
                    createOrder(customer, data);
                } catch (err) {
                    console.log(typeof createOrder);
                    console.log(err);
                }
            })
            .catch((err) => console.log(err.message));
    }

    res.status(200).end();
}


export default new StripeController();

