import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { ProductsEntity } from '../entities/products';

class ProductsController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(ProductsEntity).find({
            relations: {
                category:true,
                sub_category:true,
                company:true,
                brand:true,
                parametrs:true,
                charactics:true,
                prices:true
            }, order: { id: "ASC" }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(ProductsEntity).find({
            relations: {
                category:true,
                sub_category:true,
                company:true,
                brand:true,
                parametrs:true,
                charactics:true
            }, where: { id: +id }
        }));
    }

    public async Post(req: Request, res: Response) {
        const { name_uz, name_en, name_ru,name_tr,description_uz,description_en,description_ru,description_tr,delivery_uz,delivery_en,delivery_ru,delivery_tr,size,category,sub_category,company,brand } = req.body

        const products = await AppDataSource.getRepository(ProductsEntity).createQueryBuilder().insert().into(ProductsEntity).values({ name_uz, name_en, name_ru,name_tr,description_uz,description_en,description_ru,description_tr,delivery_uz,delivery_en,delivery_ru,delivery_tr,size,category,sub_category,company,brand  }).returning("*").execute()

        res.json({
            status: 201,
            message: "products created",
            data: products.raw[0]
        })
    }

    public async Put(req: Request, res: Response) {
        try {
            const { name_uz, name_en, name_ru,name_tr,description_uz,description_en,description_ru,description_tr,delivery_uz,delivery_en,delivery_ru,delivery_tr,size,category,sub_category,company,brand  } = req.body
            const { id } = req.params

            const products = await AppDataSource.getRepository(ProductsEntity).findOneBy({ id: +id })

            products.name_uz = name_uz != undefined ? name_uz : products.name_uz
            products.name_en = name_en != undefined ? name_en : products.name_en
            products.name_ru = name_ru != undefined ? name_ru : products.name_ru
            products.name_tr = name_tr != undefined ? name_tr : products.name_tr
            products.description_uz = description_uz != undefined ? description_uz : products.description_uz
            products.description_en = description_en != undefined ? description_en : products.description_en
            products.description_ru = description_ru != undefined ? description_ru : products.description_ru
            products.description_tr = description_tr != undefined ? description_tr : products.description_tr
            products.delivery_uz = delivery_uz != undefined ? delivery_uz : products.delivery_uz
            products.delivery_en = delivery_en != undefined ? delivery_en : products.delivery_en
            products.delivery_ru = delivery_ru != undefined ? delivery_ru : products.delivery_ru
            products.delivery_tr = delivery_tr != undefined ? delivery_tr : products.delivery_tr
            products.category = category != undefined ? category : products.category
            products.sub_category = sub_category != undefined ? sub_category : products.sub_category
            products.brand = brand != undefined ? brand : products.brand
            products.company = company != undefined ? company : products.company
            products.size = size != undefined ? size : products.size

            await AppDataSource.manager.save(products)
            res.json({
                status: 200,
                message: "products updated",
                data: products
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const products = await AppDataSource.getRepository(ProductsEntity).createQueryBuilder().delete().from(ProductsEntity).where({ id }).returning("*").execute()

            res.json({
                status: 200,
                message: "products deleted",
                data: products.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new ProductsController();