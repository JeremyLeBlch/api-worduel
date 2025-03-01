import express from "express";
import { User } from "@prisma/client"

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    linkAccount?: {
      userId: string;
      googleId: string;
    };
  }
}