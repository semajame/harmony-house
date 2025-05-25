import 'reflect-metadata'
import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import { Reservation } from './entities/reservation'
import { Staff } from './entities/staff'
import { Customer } from './entities/customer'
import { Payment } from './entities/payment'
import { Room } from './entities/rooms'


dotenv.config()

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'test',
  entities: [
    Staff,
    Customer,
    Payment,
    Reservation,
    Room,
  ],
  dropSchema: true, 
  synchronize: false,
  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  logging: true,
})

export const getDatabaseConnection = async () => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize()
      console.log("✅ Database connected successfully")
    } catch (error) {
      console.error("❌ Database connection failed:", error)
    }
  }
  return AppDataSource
}