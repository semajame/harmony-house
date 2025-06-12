import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Reservation } from './reservation'

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('varchar', { length: 255 })
  name!: string

  @Column('int')
  capacity!: number

  @Column('text', { nullable: true })
  description?: string

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number

  @Column('boolean', { default: true })
  isAvailable!: boolean

  @Column('text', { nullable: true })
  image?: string

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations!: Reservation[]

  @Column('boolean', { default: true })
  isActive!: boolean
}
