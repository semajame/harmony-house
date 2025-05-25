import 'reflect-metadata'
import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import { Staff } from './entities/staff'
import { Customer } from './entities/customer'
import { Payment } from './entities/payment'
import { Reservation } from './entities/reservation'
import { Room } from './entities/rooms'

dotenv.config()

export const MigrationDataSource = new DataSource({
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
    Room],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
})

export default MigrationDataSource