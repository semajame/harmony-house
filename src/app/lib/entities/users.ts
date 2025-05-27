import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  COSTUMER = 'costumer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('varchar', { length: 255, unique: true })
  username!: string

  @Column('varchar', { length: 255, unique: true})
  email!: string

  @Column('varchar', { length: 255 })
  password!: string

  @Column('varchar', { length: 20, nullable: true })
  phone!: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.COSTUMER,
  })
  role!: UserRole

  @Column('boolean', { default: true })
  isActive!: boolean
}
