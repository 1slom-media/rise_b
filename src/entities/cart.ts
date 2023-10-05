import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { ProductsEntity } from "./products";
import { UsersEntity } from "./users";
import { ParametrsEntity } from "./parametrs";


@Entity({ name: "cart" })
export class CartEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    @IsString()
    quantity: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => ProductsEntity, (products) => products.cart)
    products: ProductsEntity

    @ManyToOne(() => UsersEntity, (users) => users.cart)
    user: UsersEntity

    @ManyToOne(() => ParametrsEntity, (parametrs) => parametrs.cart)
    parametrs: ParametrsEntity
}