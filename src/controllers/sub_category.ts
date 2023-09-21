import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { SubCategoryEntity } from '../entities/sub_category';

class SubCategoryController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(SubCategoryEntity).find({
            relations: {
                category:true,
                size:true
            }, order: { id: "ASC" }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(SubCategoryEntity).find({
            relations: {
                category:true,
                size:true
            }, where: { id: +id }
        }));
    }

    public async Post(req: Request, res: Response) {
        const { sub_category_uz, sub_category_en, sub_category_ru,sub_category_tr,category } = req.body

        const sub_category = await AppDataSource.getRepository(SubCategoryEntity).createQueryBuilder().insert().into(SubCategoryEntity).values({ sub_category_uz, sub_category_en, sub_category_ru,sub_category_tr,category  }).returning("*").execute()

        res.json({
            status: 201,
            message: "subcategory created",
            data: sub_category.raw[0]
        })
    }

    public async Put(req: Request, res: Response) {
        try {
            const { sub_category_uz, sub_category_en, sub_category_ru,sub_category_tr,category  } = req.body
            const { id } = req.params

            const sub_category = await AppDataSource.getRepository(SubCategoryEntity).createQueryBuilder().update(SubCategoryEntity)
                .set({ sub_category_uz, sub_category_en, sub_category_ru,sub_category_tr,category  })
                .where({ id })
                .returning("*")
                .execute()

            res.json({
                status: 200,
                message: "subcategory updated",
                data: sub_category.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const sub_category = await AppDataSource.getRepository(SubCategoryEntity).createQueryBuilder().delete().from(SubCategoryEntity).where({ id }).returning("*").execute()

            res.json({
                status: 200,
                message: "subcategory deleted",
                data: sub_category.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new SubCategoryController();