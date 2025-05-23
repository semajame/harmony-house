import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

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

  @Column({ nullable: true })
  phone!: string
}
