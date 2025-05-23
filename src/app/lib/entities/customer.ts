import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Reservation } from './reservation'

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  phone!: string

  // customer.entity.ts
  @OneToMany(() => Reservation, (reservation) => reservation.customer)
  reservations!: Reservation[]
}
