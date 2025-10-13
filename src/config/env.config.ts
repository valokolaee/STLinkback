 import dotenv from 'dotenv';

dotenv.config();

const requiredVars = [
  'JWT_SECRET',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'DB_PORT',
];

requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});


export const config = {
  uploadPath: process.env.UPLOAD_PATH || 'uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB in bytes
  allowedMimeTypes: process.env.ALLOWED_MIME_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    // 'image/gif',
    // 'application/pdf'
  ]
};

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
export const PORT = parseInt(process.env.PORT as string, 10) || 3000;
// export const DB_PATH = process.env.DB_PATH as string;
export const API_BASE_URL = process.env.API_BASE_URL?.trim().replace(/\s+$/, '') as string;
export const FRONTEND_URL = process.env.FRONTEND_URL?.trim().replace(/\s+$/, '') as string;
export const ENABLE_DEV_MODE = process.env.ENABLE_DEV_MODE === 'true';
export const ADMIN_ROLE_ID = parseInt(process.env.ADMIN_ROLE_ID as string, 10);
export const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY as string;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY as string;
export const DB_HOST = process.env.DB_HOST as string;
export const DB_USER = process.env.DB_USER as string;
export const DB_PASSWORD = process.env.DB_PASSWORD as string;
export const DB_NAME = process.env.DB_NAME as string;
export const DB_DIALECT = process.env.DB_DIALECT as string;
export const DB_PORT = parseInt(process.env.DB_PORT as string, 10);