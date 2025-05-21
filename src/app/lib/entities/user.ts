import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid') // Still valid in MySQL; TypeORM will use CHAR(36)
  id!: string

  @Column({ type: 'varchar', length: 255, unique: true })
  username!: string

  @Column({ type: 'varchar', length: 255 }) // You can increase this length if needed
  password!: string

  @Column({ type: 'varchar', length: 50, default: 'user' })
  role!: string
}
