import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { ProductsEntity } from "./products";


@Entity({ name: "brand" })
export class BrandEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    @IsString()
    brand_uz: string

    @Column({ type: "varchar"})
    @IsString()
    brand_en: string

    @Column({ type: "varchar"})
    @IsString()
    brand_ru: string

    @Column({ type: "varchar"})
    @IsString()
    brand_tr: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @OneToMany(() => ProductsEntity, (products) => products.brand,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    products: ProductsEntity[]
}