// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   CreateDateColumn,
// } from 'typeorm'
// import { Customer } from './customer'
// import { Room } from './rooms'

// @Entity()
// export class Reservation {
//   @PrimaryGeneratedColumn()
//   id!: number

//   // reservation.entity.ts
//   @ManyToOne(() => Customer, (customer) => customer.reservations)
//   customer!: Customer

//   @ManyToOne(() => Room, (room) => room.reservations)
//   room!: Room

//   @Column()
//   startTime!: Date

//   @Column()
//   endTime!: Date

//   @CreateDateColumn()
//   createdAt!: Date
// }
