import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { ProductsEntity } from "./products";


@Entity({ name: "prices" })
export class PricesEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    @IsString()
    min: string

    @Column({ type: "varchar"})
    @IsString()
    max: string

    @Column({ type: "text"})
    @IsString()
    price: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => ProductsEntity, (products) => products.prices,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    products: ProductsEntity
}