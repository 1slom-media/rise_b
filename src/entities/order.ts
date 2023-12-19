import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { ProductsEntity } from "./products";
import { UsersEntity } from "./users";
import { CompanyEntity } from "./company";


@Entity({ name: "orders" })
export class OrdersEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    @IsString()
    quantity: string

    @Column({ type: "varchar"})
    @IsString()
    total_price: string

    @Column({ type: "varchar"})
    @IsString()
    product_price: string

    @Column({ type: "varchar"})
    @IsString()
    rise_price: string

    @Column({ type: "varchar"})
    @IsString()
    phone: string

    @Column({ type: "varchar", default:"waiting"})
    @IsString()
    status: string

    @Column({ type: "varchar"})
    @IsString()
    punkt: string

    @Column({ type: "jsonb"})
    indeks: object[]

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => ProductsEntity, (products) => products.orders,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    products: ProductsEntity

    @ManyToOne(() => UsersEntity, (users) => users.orders,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    user: UsersEntity

    @ManyToOne(() => CompanyEntity, (company) => company.orders,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    company: CompanyEntity
}