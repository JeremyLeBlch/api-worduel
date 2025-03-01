import { User as PrismaUser, Authentication } from "@prisma/client";

export interface UserWithAuthentications extends PrismaUser {
  authentications: Authentication[];
}