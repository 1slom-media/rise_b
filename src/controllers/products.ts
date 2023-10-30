import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { ProductsEntity } from '../entities/products';
import { CompanyEntity } from '../entities/company';

class ProductsController {
    public async Get(req: Request, res: Response): Promise<void> {
        const { brand, category, subcategory, color, size, min, max, country, sort, summ } = req.query;
        let brandIds: number[] = [];
        let categoryIds: number[] = [];
        let subcategoryIds: number[] = [];


        if (brand) {
            if (Array.isArray(brand)) {
                brandIds = brand.map(b => parseInt(b));
            } else if (typeof brand === 'string') {
                brandIds = brand.split(',').map(b => parseInt(b));
            } else {
                brandIds = [+brand];
            }
        }
        const sizes = String(size).split(',');
        if (category) {
            if (Array.isArray(category)) {
                categoryIds = category.map(b => parseInt(b));
            } else if (typeof category === 'string') {
                categoryIds = category.split(',').map(b => parseInt(b));
            } else {
                categoryIds = [+category];
            }
        } if (subcategory) {
            if (Array.isArray(subcategory)) {
                subcategoryIds = subcategory.map(b => parseInt(b));
            } else if (typeof subcategory === 'string') {
                subcategoryIds = subcategory.split(',').map(b => parseInt(b));
            } else {
                subcategoryIds = [+subcategory];
            }
        }

        let query = AppDataSource.getRepository(ProductsEntity)
            .createQueryBuilder('products')
            .leftJoinAndSelect('products.category', 'category')
            .leftJoinAndSelect('products.brand', 'brand')
            .leftJoinAndSelect('products.parametrs', 'parametrs')
            .leftJoinAndSelect('products.sub_category', 'sub_category')
            .leftJoinAndSelect('products.prices', 'prices').leftJoinAndSelect('products.company', 'company').leftJoinAndSelect('products.charactics', 'charactics').leftJoinAndSelect('products.country', 'country');

        if (brandIds.length > 0) {
            query = query.andWhere("brand.id IN (:...brandIds)", { brandIds });
        }
        if (categoryIds.length > 0) {
            query = query.andWhere("category.id IN (:...categoryIds)", { categoryIds });
        } if (subcategoryIds.length > 0) {
            query = query.andWhere("sub_category.id IN (:...subcategoryIds)", { subcategoryIds });
        }
        if (country && +country > 0) {
            query = query.andWhere('country.id = :country_id', { country_id: country });
        }
        if (min && max && +min >= 0 && +max > 0) {
            query = query
                .innerJoin('products.prices', 'price')
                .andWhere('price.price >= :min_price', { min_price: +min })
                .andWhere('price.price <= :max_price', { max_price: +max });
        }
        if (size) {
            query = query.andWhere(':sizes::character varying[] <@ products.size', { sizes })
        }
        if (sort && sort == "aksiya" || sort == "ommabop" || sort == "new") {
            query = query.andWhere('products.status=:status', { status: sort })
        }
        if (summ && summ === "max") {
            query = query.innerJoin('products.prices', 'price').orderBy('CAST(prices.price AS DECIMAL)', 'DESC');
        }
        if (summ && summ === "min") {
            query = query.innerJoin('products.prices', 'price').orderBy('CAST(prices.price AS DECIMAL)', 'ASC');
        }


        const productList = await query.getMany();
        if (color) {
            const filteredProducts = productList.filter(product =>
                product.parametrs.some(parametr => parametr.color === color)
            );

            const lastFilter = filteredProducts.map(product => {
                const matchingParams = product.parametrs.filter(parametr => parametr.color === color);
                return { ...product, parametrs: matchingParams };
            });

            res.json(lastFilter);
        } else {
            res.json(productList);
        }
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(ProductsEntity).find({
            relations: {
                category: true,
                sub_category: true,
                company: true,
                brand: true,
                parametrs: true,
                charactics: true,
                prices: true
            }, where: { id: +id }
        }));
    }

    public async Post(req: Request, res: Response) {
        const { name_uz, name_en, name_ru, name_tr, description_uz, description_en, description_ru, description_tr, status, delivery_uz, delivery_en, delivery_ru, delivery_tr, size, category, sub_category, company, brand, minimum, onsale } = req.body

        const foundCompany = await AppDataSource.getRepository(CompanyEntity).findOne({
            where: { id: +company }, relations: {
                country: true
            }
        })

        const country = foundCompany.country

        const products = await AppDataSource.getRepository(ProductsEntity).createQueryBuilder().insert().into(ProductsEntity).values({ name_uz, name_en, name_ru, name_tr, description_uz, description_en, description_ru, description_tr, status, delivery_uz, delivery_en, delivery_ru, delivery_tr, size, category, sub_category, company, brand, minimum, country, onsale }).returning("*").execute()

        res.json({
            status: 201,
            message: "products created",
            data: products.raw[0]
        })
    }

    public async Put(req: Request, res: Response) {
        try {
            const { name_uz, name_en, name_ru, name_tr, description_uz, description_en, description_ru, description_tr, status, delivery_uz, delivery_en, delivery_ru, delivery_tr, size, category, sub_category, company, brand, minimum, onsale } = req.body
            const { id } = req.params

            let country;

            if (company) {
                const foundCompany = await AppDataSource.getRepository(CompanyEntity).findOne({
                    where: { id: +company }, relations: {
                        country: true
                    }
                })

                country = foundCompany.country
            }

            const products = await AppDataSource.getRepository(ProductsEntity).findOne({
                where: { id: +id }, relations: {
                    brand: true,
                    company: true,
                    sub_category: true,
                    category: true
                }
            })

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
            products.category = category != undefined ? category : products.category.id
            products.sub_category = sub_category != undefined ? sub_category : products.sub_category.id
            products.brand = brand != undefined ? brand : products.brand.id
            products.company = company != undefined ? company : products.company.id
            products.size = size != undefined ? size : products.size
            products.minimum = minimum != undefined ? minimum : products.minimum
            products.country = country != undefined ? country : products.country
            products.status = status != undefined ? status : products.status
            products.onsale = onsale != undefined ? onsale : products.onsale

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