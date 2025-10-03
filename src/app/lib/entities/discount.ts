// entities/Discount.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from "typeorm"

@Entity("discounts")
export class Discount {
  @PrimaryGeneratedColumn()
  id!: number

  @Column("varchar", { length: 50, unique: true })
  code!: string

  @Column("int")
  discount!: number // percentage

  @Column("boolean", { default: true })
  isActive!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @Column({ type: "int", default: 1 })
  usageLimit!: number // New: max uses allowed

  @Column({ type: "timestamp", nullable: true })
  expiresAt!: Date | null // New: expiration date
}
