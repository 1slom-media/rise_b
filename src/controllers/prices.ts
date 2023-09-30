import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { PricesEntity } from '../entities/prices';

class PricesController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(PricesEntity).find({
            order: { id: "ASC" }, relations: {
                products: true
            }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(PricesEntity).find({
            where: { id: +id }, relations: {
                products: true
            }
        }));
    }

    public async Post(req: Request, res: Response) {
        const { min, max, price, products } = req.body

        const prices = await AppDataSource.getRepository(PricesEntity).createQueryBuilder().insert().into(PricesEntity).values({ min,max, price, products }).returning("*").execute()

        res.json({
            status: 201,
            message: "prices created",
            data: prices.raw[0]
        })
    }

    public async Put(req: Request, res: Response) {
        try {
            const { min,max, price, products } = req.body
            const { id } = req.params

            const prices = await AppDataSource.getRepository(PricesEntity).findOneBy({ id: +id })

            prices.min = min != undefined ? min : prices.min
            prices.max = max != undefined ? max : prices.max
            prices.price = price != undefined ? price : prices.price
            prices.products = products != undefined ? products : prices.products

            await AppDataSource.manager.save(prices)
            res.json({
                status: 200,
                message: "prices updated",
                data: prices
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const prices = await AppDataSource.getRepository(PricesEntity).createQueryBuilder().delete().from(PricesEntity).where({ id }).returning("*").execute()

            res.json({
                status: 200,
                message: "prices deleted",
                data: prices.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new PricesController();