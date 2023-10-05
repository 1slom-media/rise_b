import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { ProductsEntity } from "./products";
import { CartEntity } from "./cart";


@Entity({ name: "parametrs" })
export class ParametrsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    @IsString()
    color: string

    @Column({ type: "text"})
    @IsString()
    image1: string

    @Column({ type: "text"})
    @IsString()
    image2: string

    @Column({ type: "text"})
    @IsString()
    image3: string

    @Column({ type: "text"})
    @IsString()
    image4: string

    @Column({ type: "varchar"})
    @IsString()
    count: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => ProductsEntity, (products) => products.parametrs)
    products: ProductsEntity

    @OneToMany(() => CartEntity, (cart) => cart.parametrs)
    cart: CartEntity[]
}