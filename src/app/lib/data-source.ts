import 'reflect-metadata'
import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import { User } from './entities/users'
import { Payment } from './entities/payment'
import { Reservation } from './entities/reservation'
import { Room } from './entities/rooms'
import { Product } from './entities/product'
import { Order } from './entities/order'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'test',
  entities: [User, Payment, Reservation, Room, Product, Order],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
})

export const getDatabaseConnection = async () => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize()
      console.log('✅ API Database connected successfully')
    } catch (error) {
      console.error('❌ API Database connection failed:', error)
      throw error
    }
  }
  return AppDataSource
}
