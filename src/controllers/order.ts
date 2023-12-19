import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { OrdersEntity } from '../entities/order';
import { CartEntity } from '../entities/cart';

class OrdersController {
    public async Get(req: Request, res: Response): Promise<void> {
        const { userId } = req.query;

        if (userId && +userId > 0) {
            const carts = await AppDataSource.getRepository(OrdersEntity).find({
                order: { id: "ASC" }, relations: [
                    'products', 'products.parametrs', 'products.brand', 'user'
                ]
            });

            res.json(carts.filter(cart => cart.user.id === +userId));
        } else {
            res.json(await AppDataSource.getRepository(OrdersEntity).find({
                order: { id: "ASC" }, relations: [
                    'products', 'products.parametrs', 'products.brand', 'user'
                ]
            }));
        }
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(OrdersEntity).find({
            where: { id: +id }, relations: {
                products: true,
                user: true
            }
        }));
    }

    // public async Post(req: Request, res: Response) {
    //     const { user, punkt, phone } = req.body

    //     const carts = await AppDataSource.getRepository(CartEntity).find({
    //         relations: [
    //             'products', 'products.parametrs', 'products.brand', 'user'
    //         ]
    //     })

    //     const cartFilter = carts.filter(cart => cart.user.id === +user);

    //     for (const cart of cartFilter) {
    //         const rise_price = +cart.price - +cart.product_price
    //         const order = new OrdersEntity()
    //         order.quantity = cart.quantity
    //         order.total_price = cart.price
    //         order.product_price = cart.product_price
    //         order.rise_price = String(rise_price)
    //         order.products = cart.products
    //         order.punkt = punkt
    //         order.phone = phone
    //         order.user = user
    //         order.indeks = cart.indeks
    //         order.company = cart.company
    //         await AppDataSource.manager.save(order)
    //     }

    //     await AppDataSource.getRepository(CartEntity).remove(cartFilter);


    //     res.json({
    //         status: 201,
    //         message: "order created"
    //     })
    // }

    // public async Put(req: Request, res: Response) {
    //     try {
    //         const { quantity, products, indeks, user, price } = req.body
    //         const { id } = req.params

    //         const cart = await AppDataSource.getRepository(OrdersEntity).findOne({
    //             where: { id: +id }, relations: {
    //                 products: true,
    //                 user: true
    //             }
    //         })

    //         cart.quantity = quantity != undefined ? quantity : cart.quantity
    //         cart.products = products != undefined ? products : cart.products.id
    //         cart.indeks = indeks != undefined ? indeks : cart.indeks
    //         cart.price = price != undefined ? price : cart.price
    //         cart.user = user != undefined ? user : cart.user.id

    //         await AppDataSource.manager.save(cart)

    //         res.json({
    //             status: 200,
    //             message: "cart updated",
    //             data: cart
    //         })
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // public async Delete(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params

    //         const cart = await AppDataSource.getRepository(OrdersEntity).createQueryBuilder().delete().from(OrdersEntity).where({ id }).returning("*").execute()

    //         res.json({
    //             status: 200,
    //             message: "cart deleted",
    //             data: cart.raw[0]
    //         })
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    public async Refund(req: Request, res: Response) {
        try {
            const { id } = req.params

            const order = await AppDataSource.getRepository(OrdersEntity).createQueryBuilder().update(OrdersEntity)
                .set({ status: "refund" })
                .where({ id })
                .returning("*")
                .execute()

            res.json({
                status: 200,
                message: "order refusal",
                data: order.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new OrdersController();