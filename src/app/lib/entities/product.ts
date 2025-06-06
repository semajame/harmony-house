import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 50 })
  name!: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column("boolean", { default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
