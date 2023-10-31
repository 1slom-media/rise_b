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
import dotenv from 'dotenv'
import { CartEntity } from "./entities/cart"
import { BannerEntity } from "./entities/banner"
dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: true,
    logging: false,
    entities: [UsersEntity, CountryEntity, AdminEntity, CategoryEntity, CompanyEntity, SubCategoryEntity, BrandEntity, CardsEntity, SizeEntity, ProductsEntity, ParametrsEntity, PricesEntity, CharacticsEntity, CartEntity,BannerEntity],
    migrations: [],
    subscribers: [],
})
