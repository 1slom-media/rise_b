import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { SubCategoryEntity } from '../entities/sub_category';
import path from 'path';
import fs from 'fs';

class SubCategoryController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(SubCategoryEntity).find({
            relations: {
                category: true,
                size: true,
                products: true
            }, order: { id: "ASC" }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(SubCategoryEntity).find({
            relations: {
                category: true,
                size: true,
                products: true
            }, where: { id: +id }
        }));
    }

    public async Post(req: Request, res: Response) {
        const { sub_category_uz, sub_category_en, sub_category_ru, sub_category_tr, category } = req.body
        const { filename } = req.file;
        const image = filename

        const sub_category = await AppDataSource.getRepository(SubCategoryEntity).createQueryBuilder().insert().into(SubCategoryEntity).values({ sub_category_uz, sub_category_en, sub_category_ru, sub_category_tr, category, image }).returning("*").execute()

        res.json({
            status: 201,
            message: "subcategory created",
            data: sub_category.raw[0]
        })
    }

    public async Put(req: Request, res: Response) {
        try {
            const { sub_category_uz, sub_category_en, sub_category_ru, sub_category_tr, category } = req.body
            const { id } = req.params
            let image;
            if (req.file) {
                const { filename } = req.file;
                image = filename
            }

            // old image delete
            const oldData = await AppDataSource.getRepository(SubCategoryEntity).findOne({ where: { id: +id },relations:{
                category:true
            } })
            if (oldData && image) {
                const imageToDelete = oldData?.image;
                const imagePath = path.join(process.cwd(), 'uploads', imageToDelete);
                fs.unlinkSync(imagePath);
            } else {
                console.log("xato");
            }

            oldData.sub_category_uz = sub_category_uz != "" ? sub_category_uz : oldData.sub_category_uz
            oldData.sub_category_en = sub_category_en != "" ? sub_category_en : oldData.sub_category_en
            oldData.sub_category_ru = sub_category_ru != "" ? sub_category_ru : oldData.sub_category_ru
            oldData.sub_category_tr = sub_category_tr != "" ? sub_category_tr : oldData.sub_category_tr
            oldData.category = category != "" ? category : oldData.category.id
            oldData.image = image != undefined ? image : oldData.image

            await AppDataSource.manager.save(oldData)
            res.json({
                status: 200,
                message: "subcategory updated",
                data: oldData
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