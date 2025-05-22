import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export type StaffRole = 'Receptionist' | 'Manager' | 'Cleaner'

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 255, unique: true })
  username!: string

  @Column({ unique: true, nullable: true })
  email!: string

  @Column({ type: 'varchar', length: 255 }) // You can increase this length if needed
  password!: string

  @Column({ type: 'enum', enum: ['Receptionist', 'Manager', 'Cleaner'] })
  role!: StaffRole

  @Column({ nullable: true })
  phone!: string
}
