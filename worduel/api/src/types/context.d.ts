import {UserWithAuthentications} from "./user";
import {PrismaClient} from "@prisma/client";
import { Response } from 'express';
import { Request } from 'express';
import {PubSubEngine} from "graphql-subscriptions";

export interface MyContext {
  req: Request;
  user?: UserWithAuthentications;
  prisma: PrismaClient;
  res: Response;
  ip?: string;
  pubSub: PubSubEngine;
}