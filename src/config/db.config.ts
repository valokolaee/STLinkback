// src/config/db.config.ts
// import { Options } from 'sequelize/types';
import dotenv from 'dotenv';
import Sequelize from 'sequelize';


dotenv.config();
const dbConfig: Sequelize.Options = {
  dialect: process.env.DB_DIALECT as any,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT as string, 10),
  logging: false,
  timezone: '+00:00' , // Keeps everything in UTC, no conversion
  dialectOptions: {
    dateStrings: true, // THIS IS CRITICAL - forces string dates
    typeCast: true
  },
  define: {
    timestamps: true,
    underscored: true
  },

  
};

export default dbConfig;