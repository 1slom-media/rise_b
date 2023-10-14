import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { UsersEntity } from "./users";


@Entity({ name: "cards" })
export class CardsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    @IsString()
    card_number: string

    @Column({ type: "varchar"})
    @IsString()
    month: string

    @Column({ type: "varchar"})
    @IsString()
    cvv: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => UsersEntity, (user) => user.cards,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    user: UsersEntity
}