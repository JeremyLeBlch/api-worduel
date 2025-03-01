import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET non définie');
  process.exit(1);
}

export const SECRET_KEY = process.env.JWT_SECRET;