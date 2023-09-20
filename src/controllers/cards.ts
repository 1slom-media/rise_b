import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { CardsEntity } from '../entities/cards';

class CardsController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(CardsEntity).find({
            order: { id: "ASC" }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(CardsEntity).find({
            where: { id: +id }
        }));
    }

    public async Post(req: Request, res: Response) {
        const { card_number,month,cvv,user} = req.body

        const cards = await AppDataSource.getRepository(CardsEntity).createQueryBuilder().insert().into(CardsEntity).values({ card_number,month,cvv,user}).returning("*").execute()

        res.json({
            status: 201,
            message: "cards created",
            data: cards.raw[0]
        })
    }

    public async Put(req: Request, res: Response) {
        try {
            const { card_number,month,cvv,user} = req.body
            const { id } = req.params

            const cards = await AppDataSource.getRepository(CardsEntity).createQueryBuilder().update(CardsEntity)
                .set({ card_number,month,cvv,user})
                .where({ id })
                .returning("*")
                .execute()

            res.json({
                status: 200,
                message: "cards updated",
                data: cards.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const cards = await AppDataSource.getRepository(CardsEntity).createQueryBuilder().delete().from(CardsEntity).where({ id }).returning("*").execute()

            res.json({
                status: 200,
                message: "cards deleted",
                data: cards.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new CardsController();