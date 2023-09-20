import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { BrandEntity } from '../entities/brand';

class BrandController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(BrandEntity).find({
            order: { id: "ASC" }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(BrandEntity).find({
            where: { id: +id }
        }));
    }

    public async Post(req: Request, res: Response) {
        const { brand_uz, brand_en, brand_ru, brand_tr} = req.body

        const brand = await AppDataSource.getRepository(BrandEntity).createQueryBuilder().insert().into(BrandEntity).values({ brand_uz, brand_en, brand_ru, brand_tr}).returning("*").execute()

        res.json({
            status: 201,
            message: "brand created",
            data: brand.raw[0]
        })
    }

    public async Put(req: Request, res: Response) {
        try {
            const { brand_uz, brand_en, brand_ru, brand_tr} = req.body
            const { id } = req.params

            const brand = await AppDataSource.getRepository(BrandEntity).createQueryBuilder().update(BrandEntity)
                .set({ brand_uz, brand_en, brand_ru, brand_tr})
                .where({ id })
                .returning("*")
                .execute()

            res.json({
                status: 200,
                message: "brand updated",
                data: brand.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const brand = await AppDataSource.getRepository(BrandEntity).createQueryBuilder().delete().from(BrandEntity).where({ id }).returning("*").execute()

            res.json({
                status: 200,
                message: "brand deleted",
                data: brand.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new BrandController();