import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { Room } from './rooms'
import { Payment } from './payment'
import { User } from './users'

export enum Status {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled"
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number

  @CreateDateColumn()
  createdAt!: Date


  @Column('datetime')
  startTime!: Date

  @Column('datetime')
  endTime!: Date

  @ManyToOne(() => Room, (room) => room.reservations)
  room!: Room

  @ManyToOne('User', 'reservations')
  user!: User

  @OneToOne(() => Payment, { cascade: true })
  @JoinColumn()
  payment!: Payment;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.PENDING,
  })
  status!: Status

  @Column("boolean", { default: true })
  isActive!: boolean;
}