import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { CategoryEntity } from "./category";


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

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => CategoryEntity, (category) => category.sub_category)
    category: CategoryEntity
}