import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Reservation } from "./reservation";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 255 })
  name!: string;

  @Column("int")
  capacity!: number;

  @Column("boolean", { default: true })
  isAvailable!: boolean;

  @OneToMany(() => Reservation, reservation => reservation.room)
  reservations!: Reservation[];

  @Column("boolean", { default: true })
  isActive!: boolean;
}
