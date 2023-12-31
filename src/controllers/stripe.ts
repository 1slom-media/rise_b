import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from 'dotenv'
import { AppDataSource } from "../data-source";
import { CartEntity } from "../entities/cart";
import { OrdersEntity } from "../entities/order";
import { ProductsEntity } from "../entities/products";
import { ParametrsEntity } from "../entities/parametrs";
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
                    const price = +cart.price / + cart.quantity
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
                            unit_amount: price * 100,
                        },
                        quantity: cart.quantity,
                    }
                }),
                customer: customer.id,
                success_url: "http://localhost:3000/success",
                cancel_url: "http://localhost:3000/error-pay",
            });

            res.json({ url: session.url });
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    }

    public async PostMobile(req: Request, res: Response) {
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

            const ephemeralKey = await stripe.ephemeralKeys.create(
                { customer: customer.id }
            );

            const paymentIntent = await stripe.paymentIntents.create({
                amount: 1099,
                currency: 'usd',
                customer: customer.id,
                // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: cartFilter.map((cart: any) => {
                    const price = +cart.price / + cart.quantity
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
                            unit_amount: price * 100,
                        },
                        quantity: cart.quantity,
                    }
                }),
                customer: customer.id,
                success_url: "http://localhost:3000/success",
                cancel_url: "http://localhost:3000/error-pay",
            });

            res.json({
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
                publishableKey: 'pk_test_51AROWSJX9HHJ5bycpEUP9dK39tXufyuWogSUdeweyZEXy3LC7M8yc5d9NlQ96fRCVL0BlAu7Nqt4V7N5xZjJnrkp005fDiTMIr'
            });
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
        // console.log(customer.metadata);

        const carts = await AppDataSource.getRepository(CartEntity).find({
            relations: [
                'products', 'products.parametrs', 'company', 'user'
            ]
        })
        const cartFilter = carts.filter(cart => cart.user.id === +user);

        for (const cart of cartFilter) {
            const rise_price = +cart.price - +cart.product_price
            const order = new OrdersEntity()
            order.quantity = cart.quantity
            order.total_price = cart.price
            order.product_price = cart.product_price
            order.rise_price = String(rise_price)
            order.products = cart.products
            order.punkt = punkt
            order.phone = phone
            order.user = user
            order.indeks = cart.indeks
            order.company = cart.company
            await AppDataSource.manager.save(order);

            const productId = cart.products.id;
            const updatedProduct = await AppDataSource.getRepository(ProductsEntity).findOne({ where: { id: productId }, relations: ["parametrs"] });

            for (const indeks of cart.indeks) {
                const orderColor = indeks["color"];
                const matchingParam = updatedProduct.parametrs.find(param => param.color === orderColor)
                const parametrs = await AppDataSource.getRepository(ParametrsEntity).findOne({ where: { id: matchingParam.id } });

                const count = +parametrs.count - +indeks['count']
                parametrs.count = count.toLocaleString();

                await AppDataSource.manager.save(parametrs);
            }
        }
        await AppDataSource.getRepository(CartEntity).remove(cartFilter);

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

