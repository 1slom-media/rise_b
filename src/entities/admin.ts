import { IsString,IsEmail, Length } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { CompanyEntity } from "./company";


@Entity({ name: "admin" })
export class AdminEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", length: 200 })
    @IsString()
    name: string

    @Column({ type: "varchar", length: 200 })
    @IsString()
    surname: string

    @Column({ type: "varchar", length: 100 })
    @IsString()
    phone: string

    @Column({ type: "text" })
    @IsString()
    image: string

    @Column({ type: "varchar"})
    @Length(1, 250)
    @IsEmail()
    email: string

    @Column({ type: "varchar" })
    password: string;

    @Column({ type: "varchar",default:"admin" })
    role: string; 

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => CompanyEntity, (company) => company.admin)
    company: CompanyEntity

}