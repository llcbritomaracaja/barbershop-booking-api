import 'reflect-metadata'
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PGHOST as string,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
  username: process.env.PGUSER as string,
  password: process.env.PGPASSWORD as string,
  database: process.env.PGDATABASE as string,
  ssl: process.env.PGHOST?.includes('neon') ? {rejectUnauthorized: false} : false,
  synchronize: false,
  logging: true,
  entities: [ "src/entities/*.ts"],
  migrations: [ "src/migrations/*.ts"]

})
