import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SubCategoryEntity } from "./sub_category";

@Entity({ name: "keys" })
export class KeysEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  keys_uz: string;

  @Column()
  keys_en: string;

  @Column()
  keys_ru: string;

  @Column()
  keys_tr: string;

  @ManyToOne(() => SubCategoryEntity, (sub_category) => sub_category.keys, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  sub_category: SubCategoryEntity;
}
