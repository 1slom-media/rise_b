import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { ProductsEntity } from "./products";
import { UsersEntity } from "./users";


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

    @Column({ type: "jsonb",nullable:true })
    indeks: object[]

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => ProductsEntity, (products) => products.cart,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    products: ProductsEntity

    @ManyToOne(() => UsersEntity, (users) => users.cart,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    user: UsersEntity
}