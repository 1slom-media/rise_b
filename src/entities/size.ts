import { IsString,IsEmail, Length } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { SubCategoryEntity } from "./sub_category";


@Entity({ name: "size" })
export class SizeEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar",})
    @IsString()
    size: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => SubCategoryEntity, (sub_category) => sub_category.size,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    sub_category: SubCategoryEntity

}