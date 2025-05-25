import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Reservation } from "./reservation";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 255 })
  name!: string;

  @Column("varchar", { length: 255 })
  email!: string;

  @Column("varchar", { length: 20, nullable: true })
  phone?: string;

  @OneToMany("Reservation", "customer")
  reservations!: Reservation[];

  @Column("boolean", { default: true })
  isActive!: boolean;
}