import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm'
import { User } from './users' // still import the type here

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('varchar', { length: 255 })
  room!: string

  @Column('varchar', { length: 255 })
  name!: string

  @Column('varchar', { length: 255 })
  email!: string

  @Column('int')
  rating!: number

  @Column('text')
  message!: string

  @CreateDateColumn()
  createdAt!: Date

  @ManyToOne(
    () => (require('./users') as { User: typeof User }).User,
    (user) => user.reviews,
    {
      onDelete: 'CASCADE',
      nullable: false,
    }
  )
  user!: User
}
