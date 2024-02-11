import { AppDataSource } from "./data-source"
import { CategoryEntity } from "./entities/category"
import { CompanyEntity } from "./entities/company";
import { ProductsEntity } from "./entities/products";
import { SubCategoryEntity } from "./entities/sub_category";

export const resolvers = {
    Query: {
        category: async () => {
            const category = await AppDataSource.getRepository(CategoryEntity).find({
                relations: {
                    sub_category: true,
                    products: true
                }
            })
            return category;
        },
        company: async () => {
            const company = await AppDataSource.getRepository(CompanyEntity).find({
                relations: {
                    country: true,
                    admin: true,
                    products: true,
                    brand: true
                }
            })
            return company;
        },
        sub_category: async (_,{category}) => {
            let query = AppDataSource.getRepository(SubCategoryEntity)
                .createQueryBuilder('sub_category')
                .leftJoinAndSelect('sub_category.category', 'category')
                .leftJoinAndSelect('sub_category.size', 'size')
                .leftJoinAndSelect('sub_category.products', 'products').orderBy('sub_category.id', 'ASC')

            if(!category){
                return await query.getMany();
            }else{
                return await query.where("category.id = :category_id",{category_id:category}).getMany();
            }
        },
        products: async (_, { brand, category, subcategory, color, size, min, max, country, sort, summ, skip, take, company }) => {
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
            if (skip && take) {
                query = query.skip(+take * (+skip - 1)).take(+take)
            }
            if (categoryIds.length > 0) {
                query = query.andWhere("category.id IN (:...categoryIds)", { categoryIds });
            } if (subcategoryIds.length > 0) {
                query = query.andWhere("sub_category.id IN (:...subcategoryIds)", { subcategoryIds });
            }
            if (country && +country > 0) {
                query = query.andWhere('country.id = :country_id', { country_id: country });
            }
            if (company && +company > 0) {
                query = query.andWhere('company.id = :company_id', { company_id: company });
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

            const productList = await query.orderBy('products.id', 'DESC').getMany();
            if (color) {
                const filteredProducts = productList.filter(product =>
                    product.parametrs.some(parametr => parametr.color === color)
                );

                const lastFilter = filteredProducts.map(product => {
                    const matchingParams = product.parametrs.filter(parametr => parametr.color === color);
                    return { ...product, parametrs: matchingParams };
                });

                return lastFilter
            } else {
                return productList
            }
        }
    }
}