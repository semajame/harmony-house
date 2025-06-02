import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./users";
import { Product } from "./product";

export enum OrderStatus {
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column('int')
  user_id!: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column('int')
  product_id!: number;

  @Column('int', { default: 1 })
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unit_price!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_price!: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}