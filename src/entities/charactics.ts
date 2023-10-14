import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { ProductsEntity } from "./products";


@Entity({ name: "charactics" })
export class CharacticsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    @IsString()
    parametr_uz: string

    @Column({ type: "varchar"})
    @IsString()
    parametr_en: string

    @Column({ type: "varchar"})
    @IsString()
    parametr_ru: string

    @Column({ type: "varchar"})
    @IsString()
    parametr_tr: string

    @Column({ type: "text"})
    @IsString()
    information_uz: string

    @Column({ type: "text"})
    @IsString()
    information_en: string

    @Column({ type: "text"})
    @IsString()
    information_ru: string

    @Column({ type: "text"})
    @IsString()
    information_tr: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => ProductsEntity, (products) => products.charactics,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    products: ProductsEntity
}