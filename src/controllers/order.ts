import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { OrdersEntity } from '../entities/order';
import { CartEntity } from '../entities/cart';
import { ProductsEntity } from '../entities/products';
import { ParametrsEntity } from '../entities/parametrs';

class OrdersController {
    public async Get(req: Request, res: Response): Promise<void> {
        const { userId } = req.query;

        if (userId && +userId > 0) {
            const carts = await AppDataSource.getRepository(OrdersEntity).find({
                order: { id: "DESC" }, relations: [
                    'products', 'products.parametrs', 'company', 'user'
                ]
            });

            res.json(carts.filter(cart => cart.user?.id === +userId));
        } else {
            res.json(await AppDataSource.getRepository(OrdersEntity).find({
                order: { id: "DESC" }, relations: [
                    'products', 'products.parametrs', 'company', 'user'
                ]
            }));
        }
    }

    public async GetStatus(req: Request, res: Response): Promise<void> {
        const { status, company } = req.query;

        let query = AppDataSource.getRepository(OrdersEntity)
            .createQueryBuilder("orders")
            .leftJoinAndSelect('orders.products', 'products')
            .leftJoinAndSelect('products.parametrs', 'parametrs')
            .leftJoinAndSelect('orders.company', 'company')
            .leftJoinAndSelect('orders.user', 'user');

        if (status && +status.length>1) {
            query = query.andWhere("orders.status = :status", { status: status });
        }
        if (company && +company > 0) {
            query = query.andWhere("company.id = :company", { company: company });
        }

        const orderList = await query.orderBy('orders.id', 'DESC').getMany();
        res.json(orderList);
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(OrdersEntity).find({
            where: { id: +id }, relations: [
                'products', 'products.parametrs', 'company', 'user'
            ]
        }));
    }

    public async Post(req: Request, res: Response) {
        const { user, punkt, phone } = req.body
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

        res.json({
            status: 201,
            message: "order created"
        })
    }

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

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const cart = await AppDataSource.getRepository(OrdersEntity).createQueryBuilder().delete().from(OrdersEntity).where({ id }).returning("*").execute()

            res.json({
                status: 200,
                message: "cart deleted",
                data: cart.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }

    // order yetib keldi
    public async Secces(req: Request, res: Response) {
        try {
            const { id } = req.params

            const order = await AppDataSource.getRepository(OrdersEntity).createQueryBuilder().update(OrdersEntity)
                .set({ status: "success" })
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

    // tavar kutish xolatida
    public async Waiting(req: Request, res: Response) {
        try {
            const { id } = req.params

            const order = await AppDataSource.getRepository(OrdersEntity).createQueryBuilder().update(OrdersEntity)
                .set({ status: "waiting" })
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

    // order qaytarilmoqchi
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

    // order qaytarildi
    public async Refunded(req: Request, res: Response) {
        try {
            const { id } = req.params

            const order = await AppDataSource.getRepository(OrdersEntity).createQueryBuilder().update(OrdersEntity)
                .set({ status: "refunded" })
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