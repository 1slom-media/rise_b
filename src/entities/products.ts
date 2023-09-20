import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { CategoryEntity } from "./category";


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

    @Column({ type: "varchar"})
    @IsString()
    color: string

    @Column({ type: "varchar"})
    @IsString()
    size: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => CategoryEntity, (category) => category.sub_category)
    category: CategoryEntity
}