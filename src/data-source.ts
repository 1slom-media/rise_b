import "reflect-metadata"
import { DataSource } from "typeorm"
import { UsersEntity } from "./entities/users"
import { CountryEntity } from "./entities/country"
import { AdminEntity } from "./entities/admin"
import { CategoryEntity } from "./entities/category"
import { CompanyEntity } from "./entities/company"
import { SubCategoryEntity } from "./entities/sub_category"
import { BrandEntity } from "./entities/brand"
import { CardsEntity } from "./entities/cards"
import { SizeEntity } from "./entities/size"
import { ProductsEntity } from "./entities/products"
import { ParametrsEntity } from "./entities/parametrs"
import { PricesEntity } from "./entities/prices"
import { CharacticsEntity } from "./entities/charactics"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "j8M*.a:gQwyV5G",
    database: "rise_b",
    synchronize: true,
    logging: false,
    entities: [UsersEntity,CountryEntity,AdminEntity,CategoryEntity,CompanyEntity,SubCategoryEntity,BrandEntity,CardsEntity,SizeEntity,ProductsEntity,ParametrsEntity,PricesEntity,CharacticsEntity],
    migrations: [],
    subscribers: [],
})
