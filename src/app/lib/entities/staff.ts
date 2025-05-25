import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export enum StaffRole {
  ADMIN = 'admin',
  STAFF = 'staff'
}


@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id!: number

  @Column("varchar", { length: 255, unique: true })
  username!: string

  @Column("varchar", { length: 255, unique: true, nullable: true })
  email!: string

  @Column("varchar", { length: 255 })
  password!: string

  @Column("varchar", { length: 20, nullable: true })
  phone!: string

  @Column({
    type: "enum",
    enum: StaffRole,
    default: StaffRole.STAFF,
  })
  role!: StaffRole

  @Column("boolean", { default: true })
  isActive!: boolean;
}