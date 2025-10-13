// src/config/db.config.ts
import { Options } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const dbConfig: Options = {
  dialect: process.env.DB_DIALECT as any,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT as string, 10),
  logging: false,
};

export default dbConfig;