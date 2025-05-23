import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Staff } from '@/app/lib/entities/staff' // Import your entity files
// import { Customer } from './entities/customer'
// import { Reservation } from './entities/reservation'
// import { Room } from './entities/rooms'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST as string,
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USER as string,
  password: process.env.DATABASE_PASSWORD as string,
  database: process.env.DATABASE_NAME as string,
  entities: [Staff],
  synchronize: true, // Set to false in production
  logging: true, // Set to false in production
})

export const getDatabaseConnection = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }
  return AppDataSource
}
