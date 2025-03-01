import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const allowedOrigin = process.env.NODE_ENV === 'production'
  ? process.env.PROD_ORIGIN
  : process.env.DEV_ORIGIN;

export const corsConfig = cors({
  origin: allowedOrigin,
  credentials: true,
});