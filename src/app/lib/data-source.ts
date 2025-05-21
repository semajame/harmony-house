import 'reflect-metadata'
import { DataSource } from 'typeorm'
import mysql from 'mysql2/promise'
import { Users } from '@/app/lib/entities/user' // Import your entity files

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST as string,
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USER as string,
  password: process.env.DATABASE_PASSWORD as string,
  database: process.env.DATABASE_NAME as string,
  entities: [Users], // Add all your entities here
  synchronize: true, // Set to false in production
  logging: true, // Set to false in production
})

export const getDatabaseConnection = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }
  return AppDataSource
}
