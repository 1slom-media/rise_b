import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { ProductsEntity } from "./products";
import { UsersEntity } from "./users";
import { CompanyEntity } from "./company";


@Entity({ name: "cart" })
export class CartEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    @IsString()
    quantity: string

    @Column({ type: "varchar",nullable:true })
    @IsString()
    price: string

    @Column({ type: "varchar",nullable:true })
    @IsString()
    product_price: string

    @Column({ type: "jsonb",nullable:true })
    indeks: object[]

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => ProductsEntity, (products) => products.cart,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    products: ProductsEntity

    @ManyToOne(() => CompanyEntity, (company) => company.cart,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    company: CompanyEntity

    @ManyToOne(() => UsersEntity, (users) => users.cart,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    user: UsersEntity
}