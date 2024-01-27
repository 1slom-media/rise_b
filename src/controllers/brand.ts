import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { BrandEntity } from '../entities/brand';

class BrandController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(BrandEntity).find({
            order: { id: "ASC" }, relations: {
                products: true,
                company: true
            }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(BrandEntity).find({
            where: { id: +id }, relations: {
                products: true,
                company: true
            }
        }));
    }

    public async Post(req: Request, res: Response) {
        const { brand_uz, brand_en, brand_ru, brand_tr, company } = req.body

        const brand = await AppDataSource.getRepository(BrandEntity).createQueryBuilder().insert().into(BrandEntity).values({ brand_uz, brand_en, brand_ru, brand_tr, company }).returning("*").execute()

        res.json({
            status: 201,
            message: "brand created",
            data: brand.raw[0]
        })
    }

    public async Put(req: Request, res: Response) {
        try {
            const { brand_uz, brand_en, brand_ru, brand_tr, company } = req.body
            const { id } = req.params

            const brand = await AppDataSource.getRepository(BrandEntity).findOne({ where: { id: +id }, relations: { company: true } })

            brand.brand_uz = brand_uz != undefined ? brand_uz : brand.brand_uz
            brand.brand_en = brand_en != undefined ? brand_en : brand.brand_en
            brand.brand_ru = brand_ru != undefined ? brand_ru : brand.brand_ru
            brand.brand_tr = brand_tr != undefined ? brand_tr : brand.brand_tr
            brand.company = company != undefined ? company : brand.company.id

            await AppDataSource.manager.save(brand)
            res.json({
                status: 200,
                message: "brand updated",
                data: brand
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