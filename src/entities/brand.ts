import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { ProductsEntity } from "./products";
import { CompanyEntity } from "./company";


@Entity({ name: "brand" })
export class BrandEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    @IsString()
    brand_uz: string

    @Column({ type: "varchar" })
    @IsString()
    brand_en: string

    @Column({ type: "varchar" })
    @IsString()
    brand_ru: string

    @Column({ type: "varchar" })
    @IsString()
    brand_tr: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => CompanyEntity, (company) => company.brand, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    company: CompanyEntity

    @OneToMany(() => ProductsEntity, (products) => products.brand, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    products: ProductsEntity[]

}