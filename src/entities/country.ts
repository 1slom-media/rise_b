import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, OneToMany } from "typeorm";
import { CompanyEntity } from "./company";
import { ProductsEntity } from "./products";


@Entity({ name: "country" })
export class CountryEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    @IsString()
    country_uz: string

    @Column({ type: "varchar"})
    @IsString()
    country_en: string

    @Column({ type: "varchar"})
    @IsString()
    country_ru: string

    @Column({ type: "varchar"})
    @IsString()
    country_tr: string

    @Column({ type: "text"})
    @IsString()
    image: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @OneToMany(() => CompanyEntity, (company) => company.country,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    company: CompanyEntity[]

    @OneToMany(() => ProductsEntity, (products) => products.country,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    products: ProductsEntity[]
}