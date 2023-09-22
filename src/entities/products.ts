import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { CategoryEntity } from "./category";
import { SubCategoryEntity } from "./sub_category";
import { BrandEntity } from "./brand";
import { CompanyEntity } from "./company";
import { ParametrsEntity } from "./parametrs";


@Entity({ name: "products" })
export class ProductsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    @IsString()
    name_uz: string

    @Column({ type: "varchar"})
    @IsString()
    name_en: string

    @Column({ type: "varchar"})
    @IsString()
    name_ru: string

    @Column({ type: "varchar"})
    @IsString()
    name_tr: string

    @Column({ type: "simple-array",nullable:true})
    size: object[]

    @Column({ type: "varchar" })
    description_uz: string

    @Column({ type: "varchar" })
    description_en: string

    @Column({ type: "varchar" })
    description_ru: string

    @Column({ type: "varchar" })
    description_tr: string

    @Column({ type: "varchar" })
    delivery_uz: string

    @Column({ type: "varchar" })
    delivery_en: string

    @Column({ type: "varchar" })
    delivery_ru: string

    @Column({ type: "varchar" })
    delivery_tr: string

    @Column({ type: "varchar" })
    charactic_uz: string

    @Column({ type: "varchar" })
    charactic_en: string

    @Column({ type: "varchar" })
    charactic_ru: string

    @Column({ type: "varchar" })
    charactic_tr: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => CategoryEntity, (category) => category.products)
    category: CategoryEntity

    @ManyToOne(() => SubCategoryEntity, (sub_category) => sub_category.products)
    sub_category: SubCategoryEntity

    @ManyToOne(() => BrandEntity, (brand) => brand.products)
    brand: BrandEntity

    @ManyToOne(() => CompanyEntity, (company) => company.products)
    company: CompanyEntity

    @OneToMany(() => ParametrsEntity, (parametrs) => parametrs.products)
    parametrs: ParametrsEntity[]
} 