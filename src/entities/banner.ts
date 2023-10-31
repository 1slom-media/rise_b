import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn} from "typeorm";

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
}