import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { CartEntity } from '../entities/cart';

class CartController {
    public async Get(req: Request, res: Response): Promise<void> {
        const { userId } = req.query;

        let query = AppDataSource.getRepository(CartEntity)
            .createQueryBuilder('cart')
            .leftJoinAndSelect('cart.products', 'products')
            .leftJoinAndSelect('cart.user', 'user')
            .orderBy("cart.id", 'ASC')

        if (userId && +userId > 0) {
            query = query.where('cart.user.id = :user_id', { user_id: userId });
        }

        const cart = await query.getMany();
        res.json(cart);
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(CartEntity).find({
            where: { id: +id }, relations: {
                products: true,
                user: true
            }
        }));
    }

    public async Post(req: Request, res: Response) {
        const { quantity, products, indeks, user } = req.body

        const cart = new CartEntity()
        cart.quantity=quantity
        cart.products=products
        cart.indeks=indeks
        cart.user=user

        await AppDataSource.manager.save(cart)

        res.json({
            status: 201,
            message: "cart created",
            data: cart
        })
    }

    public async Put(req: Request, res: Response) {
        try {
            const { quantity, products, indeks, user } = req.body
            const { id } = req.params

            const cart = await AppDataSource.getRepository(CartEntity).findOne({
                where: { id: +id }, relations: {
                    products: true,
                    user: true
                }
            })

            cart.quantity = quantity != undefined ? quantity : cart.quantity
            cart.products = products != undefined ? products : cart.products.id
            cart.indeks = indeks != undefined ? indeks : cart.indeks
            cart.user = user != undefined ? user : cart.user.id

            await AppDataSource.manager.save(cart)

            res.json({
                status: 200,
                message: "cart updated",
                data: cart
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const cart = await AppDataSource.getRepository(CartEntity).createQueryBuilder().delete().from(CartEntity).where({ id }).returning("*").execute()

            res.json({
                status: 200,
                message: "cart deleted",
                data: cart.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new CartController();