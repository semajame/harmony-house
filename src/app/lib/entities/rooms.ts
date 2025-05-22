import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Reservation } from './reservation'

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string // e.g. Room A, Room B

  @Column()
  capacity!: number

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations!: Reservation[]
}
