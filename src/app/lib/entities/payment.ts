import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";


//TODO: add transaction fields later for online transactions
@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  amount!: number;

  @Column("varchar", { length: 50 })
  method!: string;

  @CreateDateColumn()
  paidAt!: Date;

  //no neeed for isactive, as payments are one time transactions
  // @Column("boolean", { default: true })
  // isActive!: boolean;
}