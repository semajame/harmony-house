import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Reservation } from './reservation'
import { Review } from './review'

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('varchar', { length: 255, unique: true })
  username!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('varchar', { length: 255, unique: true })
  email!: string

  @Column('varchar', { length: 255 })
  password!: string

  @Column('varchar', { length: 20, nullable: true })
  phone!: string

  @OneToMany('Reservation', 'customer')
  reservations!: Reservation[]

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role!: UserRole

  @OneToMany(
    () => (require('./review') as { Review: typeof Review }).Review,
    (review) => review.user
  )
  reviews!: Review[]

  @Column('boolean', { default: true })
  isActive!: boolean
}
