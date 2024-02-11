import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { CartEntity } from '../entities/cart';
import { ProductsEntity } from '../entities/products';

class CartController {
    public async Get(req: Request, res: Response): Promise<void> {
        const { userId } = req.query;

        if (userId && +userId > 0){
            const carts=await AppDataSource.getRepository(CartEntity).find({
                order: { id: "ASC" }, relations: [
                    'products','products.parametrs','company','user'
                ]
            });

            res.json(carts.filter(cart=>cart.user?.id===+userId));
        }else{
            res.json(await AppDataSource.getRepository(CartEntity).find({
                order: { id: "ASC" }, relations: [
                    'products','products.parametrs','company','user'
                ]
            }));
        }
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(CartEntity).find({
            where: { id: +id }, relations: {
                products: true,
                user: true,
                company:true
            }
        }));
    }

    public async Post(req: Request, res: Response) {
        const { quantity, products, indeks, user, price,product_price} = req.body

        const productsFind = await AppDataSource.getRepository(ProductsEntity).find({
            where:{id:+products},relations:{
                company:true
            }
        })
        const cart = new CartEntity()
        cart.quantity = quantity
        cart.products = products
        cart.indeks = indeks
        cart.price = price
        cart.product_price=product_price
        cart.user = user
        cart.company=productsFind[0]?.company

        await AppDataSource.manager.save(cart)

        res.json({
            status: 201,
            message: "cart created",
            data: cart
        })
    }

    public async Put(req: Request, res: Response) {
        try {
            const { quantity, products, indeks, user, price,product_price} = req.body
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
            cart.price = price != undefined ? price : cart.price
            cart.product_price = product_price != undefined ? product_price : cart.product_price
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