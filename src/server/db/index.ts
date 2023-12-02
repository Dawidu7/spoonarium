import dotenv from "dotenv"
import { drizzle } from "drizzle-orm/mysql2"
import { createPool } from "mysql2/promise"
import * as schema from "./schema"

dotenv.config({ path: ".env.local" })

export const pool = createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_DATABASE as string,
})

export const db = drizzle(pool, { mode: "default", schema })
