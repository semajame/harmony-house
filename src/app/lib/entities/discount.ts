import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity("discounts")
export class Discount {
  @PrimaryGeneratedColumn()
  id!: number

  @Column("varchar", { length: 50, unique: true })
  code!: string

  @Column("int")
  discount!: number // percentage

  @Column("boolean", { default: true }) // explicitly specify type
  isActive!: boolean

  @Column({ type: "timestamp", nullable: true })
  expiresAt?: Date

  @Column({ type: "int", default: 0 })
  usageCount!: number // explicitly type as int

  @Column({ type: "int", nullable: true })
  usageLimit?: number

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
