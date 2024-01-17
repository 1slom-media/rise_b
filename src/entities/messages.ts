import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { AdminEntity } from "./admin";
import { UsersEntity } from "./users";

@Entity({ name: "messages" })
export class MessagesEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    @IsString()
    message: string

    @Column({ type: "varchar",default:"not_read"})
    @IsString()
    status: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => AdminEntity, (admin) => admin.messages,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    admin: AdminEntity

    @ManyToOne(() => UsersEntity, (users) => users.messages,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    users: UsersEntity
}