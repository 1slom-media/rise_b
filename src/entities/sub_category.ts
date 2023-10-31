import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { CategoryEntity } from "./category";
import { SizeEntity } from "./size";
import { ProductsEntity } from "./products";

@Entity({ name: "sub_category" })
export class SubCategoryEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    @IsString()
    sub_category_uz: string

    @Column({ type: "varchar"})
    @IsString()
    sub_category_en: string

    @Column({ type: "varchar"})
    @IsString()
    sub_category_ru: string

    @Column({ type: "varchar"})
    @IsString()
    sub_category_tr: string

    @Column({ type: "text",nullable:true})
    @IsString()
    image: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => CategoryEntity, (category) => category.sub_category,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    category: CategoryEntity

    @OneToMany(() => SizeEntity, (size) => size.sub_category,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    size: SizeEntity[]

    @OneToMany(() => ProductsEntity, (products) => products.sub_category,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    products: ProductsEntity[]
}