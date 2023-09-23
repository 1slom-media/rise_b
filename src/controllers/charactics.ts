import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { CharacticsEntity } from '../entities/charactics';

class PricesController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(CharacticsEntity).find({
            order: { id: "ASC" }, relations: {
                products: true
            }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(CharacticsEntity).find({
            where: { id: +id }, relations: {
                products: true
            }
        }));
    }

    public async Post(req: Request, res: Response) {
        const { parametr_uz, parametr_en,parametr_ru,parametr_tr,information_uz,information_ru,information_en,information_tr, products } = req.body

        const charactics = await AppDataSource.getRepository(CharacticsEntity).createQueryBuilder().insert().into(CharacticsEntity).values({ parametr_uz, parametr_en,parametr_ru,parametr_tr,information_uz,information_ru,information_en,information_tr, products }).returning("*").execute()

        res.json({
            status: 201,
            message: "charactics created",
            data: charactics.raw[0]
        })
    }

    public async Put(req: Request, res: Response) {
        try {
            const { parametr_uz, parametr_en,parametr_ru,parametr_tr,information_uz,information_ru,information_en,information_tr, products } = req.body
            const { id } = req.params

            const charactics = await AppDataSource.getRepository(CharacticsEntity).findOneBy({ id: +id })

            charactics.parametr_uz = parametr_uz != undefined ? parametr_uz : charactics.parametr_uz
            charactics.parametr_ru = parametr_ru != undefined ? parametr_ru : charactics.parametr_ru
            charactics.parametr_en = parametr_en != undefined ? parametr_en : charactics.parametr_en
            charactics.parametr_tr = parametr_tr != undefined ? parametr_tr : charactics.parametr_tr
            charactics.information_uz = information_uz != undefined ? information_uz : charactics.information_uz
            charactics.information_ru = information_ru != undefined ? information_ru : charactics.information_ru
            charactics.information_en = information_en != undefined ? information_en : charactics.information_en
            charactics.information_tr = information_tr != undefined ? information_tr : charactics.information_tr
            charactics.products = products != undefined ? products : charactics.products

            await AppDataSource.manager.save(charactics)
            res.json({
                status: 200,
                message: "charactics updated",
                data: charactics
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const charactics = await AppDataSource.getRepository(CharacticsEntity).createQueryBuilder().delete().from(CharacticsEntity).where({ id }).returning("*").execute()

            res.json({
                status: 200,
                message: "charactics deleted",
                data: charactics.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new PricesController();