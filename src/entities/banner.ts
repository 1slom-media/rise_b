import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, ManyToOne} from "typeorm";
import { SubCategoryEntity } from "./sub_category";

@Entity({ name: "banner" })
export class BannerEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    @IsString()
    status: string

    @Column({ type: "text"})
    @IsString()
    image: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => SubCategoryEntity, (sub_category) => sub_category.banner, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    sub_category: SubCategoryEntity
}