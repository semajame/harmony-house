import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid') // Good: UUIDs stored as CHAR(36) in MySQL
  id!: string

  @Column({ type: 'varchar', length: 255, unique: true })
  username!: string

  @Column({ type: 'varchar', length: 255 })
  password!: string

  @Column({ type: 'varchar', length: 50, default: 'user' })
  role!: string
}
