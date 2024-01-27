import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import path from 'path';
import fs from 'fs';
import { CategoryEntity } from '../entities/category';

class CategoryController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(CategoryEntity).find({
            relations: {
                sub_category: true,
                products: true
            }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(CategoryEntity).find({
            where: { id: +id }, relations: {
                sub_category: true,
                products: true
            }
        }));
    }

    public async Post(req: Request, res: Response) {
        try {
            const { category_uz, category_en, category_ru, category_tr } = req.body
            const { filename } = req.file;
            const image = filename

            const category = await AppDataSource.getRepository(CategoryEntity).createQueryBuilder().insert().into(CategoryEntity).values({ category_uz, category_en, category_ru, category_tr, image }).returning("*").execute()

            res.json({
                status: 201,
                message: "category created",
                data: category.raw[0]
            })
        } catch (error) {
            console.log(error);
        }

    }

    public async Put(req: Request, res: Response) {
        try {
            const { category_uz, category_en, category_ru, category_tr } = req.body
            const { id } = req.params
            let image;
            if(req.file){
                const { filename } = req.file;
                image=filename
            }

            // old image delete
            const oldData = await AppDataSource.getRepository(CategoryEntity).findOne({ where: { id: +id } })
            if (oldData && image!=undefined) {
                const imageToDelete = oldData?.image;
                const imagePath = path.join(process.cwd(), 'uploads', imageToDelete);
                fs.unlinkSync(imagePath);
            } else {
                console.log("xato");
            }

            oldData.category_uz = category_uz != "" ? category_uz : oldData.category_uz
            oldData.category_en = category_en != "" ? category_en : oldData.category_en
            oldData.category_ru = category_ru != "" ? category_ru : oldData.category_ru
            oldData.category_tr = category_tr != "" ? category_tr : oldData.category_tr
            oldData.image = image != undefined ? image : oldData.image

            await AppDataSource.manager.save(oldData)

            res.json({
                status: 200,
                message: "category updated",
                data: oldData
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const oldData = await AppDataSource.getRepository(CategoryEntity).findOne({ where: { id: +id } })
            if (oldData) {
                const imageToDelete = oldData?.image;
                const imagePath = path.join(process.cwd(), 'uploads', imageToDelete);
                fs.unlinkSync(imagePath);
            } else {
                console.log("xato");
            }
            const category = await AppDataSource.getRepository(CategoryEntity).createQueryBuilder().delete().from(CategoryEntity).where({ id }).returning("*").execute()

            res.json({
                status: 200,
                message: "category deleted",
                data: category.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new CategoryController();