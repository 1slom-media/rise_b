import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { CategoryEntity } from "./category";
import { SubCategoryEntity } from "./sub_category";
import { BrandEntity } from "./brand";
import { CompanyEntity } from "./company";
import { ParametrsEntity } from "./parametrs";
import { PricesEntity } from "./prices";
import { CharacticsEntity } from "./charactics";
import { CartEntity } from "./cart";
import { CountryEntity } from "./country";
import { OrdersEntity } from "./order";


@Entity({ name: "products" })
export class ProductsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    @IsString()
    name_uz: string

    @Column({ type: "varchar" })
    @IsString()
    name_en: string

    @Column({ type: "varchar" })
    @IsString()
    name_ru: string

    @Column({ type: "varchar" })
    @IsString()
    name_tr: string

    @Column({ type: "varchar", array: true, nullable: true })
    size: string[]

    @Column({ type: 'varchar', nullable: true })
    @IsString()
    minimum: string

    @Column({ type: "varchar" })
    description_uz: string

    @Column({ type: "varchar" })
    description_en: string

    @Column({ type: "varchar" })
    description_ru: string

    @Column({ type: "varchar" })
    description_tr: string

    @Column({ type: "varchar" })
    delivery_uz: string

    @Column({ type: "varchar" })
    delivery_en: string

    @Column({ type: "varchar" })
    delivery_ru: string

    @Column({ type: "varchar" })
    delivery_tr: string

    @Column({ type: "varchar",nullable:true})
    status: string

    @Column({ type: "varchar",default:"sale"})
    onsale: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => CategoryEntity, (category) => category.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    category: CategoryEntity

    @ManyToOne(() => SubCategoryEntity, (sub_category) => sub_category.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    sub_category: SubCategoryEntity

    @ManyToOne(() => CountryEntity, (country) => country.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    country: CountryEntity

    @ManyToOne(() => BrandEntity, (brand) => brand.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    brand: BrandEntity

    @ManyToOne(() => CompanyEntity, (company) => company.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    company: CompanyEntity

    @OneToMany(() => ParametrsEntity, (parametrs) => parametrs.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    parametrs: ParametrsEntity[]

    @OneToMany(() => PricesEntity, (prices) => prices.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    prices: PricesEntity[]

    @OneToMany(() => CharacticsEntity, (charactics) => charactics.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    charactics: CharacticsEntity[]

    @OneToMany(() => CartEntity, (cart) => cart.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    cart: CartEntity[]

    @OneToMany(() => OrdersEntity, (orders) => orders.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    orders: OrdersEntity[]
} 