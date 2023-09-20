import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { CountryEntity } from "./country";
import { AdminEntity } from "./admin";


@Entity({ name: "company" })
export class CompanyEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    @IsString()
    company: string

    @Column({ type: "text"})
    @IsString()
    image: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    @ManyToOne(() => CountryEntity, (country) => country.company)
    country: CountryEntity

    @OneToMany(() => AdminEntity, (admin) => admin.company)
    admin: AdminEntity[]
}