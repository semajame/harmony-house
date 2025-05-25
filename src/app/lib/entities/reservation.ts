import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn
} from "typeorm";
import { Room } from "./rooms";
import { Customer } from "./customer";
import { Payment } from "./payment";

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column("datetime")
  startTime!: Date;

  @Column("datetime")
  endTime!: Date;

  @ManyToOne(() => Room, room => room.reservations)
  room!: Room;

  @ManyToOne(() => Customer, customer => customer.reservations)
  customer!: Customer;

  @OneToOne(() => Payment, { cascade: true })
  @JoinColumn()
  payment!: Payment;
}