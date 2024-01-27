import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { CountryEntity } from "./country";
import { AdminEntity } from "./admin";
import { ProductsEntity } from "./products";
import { BrandEntity } from "./brand";
import { OrdersEntity } from "./order";
import { CartEntity } from "./cart";


@Entity({ name: "company" })
export class CompanyEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    @IsString()
    company: string

    @Column({ type: "text" })
    @IsString()
    image: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => CountryEntity, (country) => country.company, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    country: CountryEntity

    @OneToMany(() => AdminEntity, (admin) => admin.company, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    admin: AdminEntity[]

    @OneToMany(() => BrandEntity, (brand) => brand.company, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    brand: BrandEntity[]

    @OneToMany(() => ProductsEntity, (products) => products.company, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    products: ProductsEntity[]

    @OneToMany(() => CartEntity, (cart) => cart.company, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    cart: CartEntity[]

    @OneToMany(() => OrdersEntity, (orders) => orders.company, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    orders: OrdersEntity[]
}