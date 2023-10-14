import { IsEmail, IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { CardsEntity } from "./cards";
import { CartEntity } from "./cart";



@Entity({ name: "users" })
export class UsersEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", nullable: true })
    @IsString()
    @IsEmail()
    email: string

    @Column({ type: "varchar", nullable: true })
    @IsString()
    name: string

    @Column({ type: "varchar", nullable: true })
    @IsString()
    surname: string

    @Column({ type: "varchar", nullable: true })
    @IsString()
    phone: string

    @Column({ type: "varchar", nullable: true })
    password: string;

    @Column({ type: "boolean", default: false })
    verify: boolean;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @OneToMany(() => CardsEntity, (cards) => cards.user,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    cards: CardsEntity[]

    @OneToMany(() => CartEntity, (cart) => cart.user,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    cart: CartEntity[]
}