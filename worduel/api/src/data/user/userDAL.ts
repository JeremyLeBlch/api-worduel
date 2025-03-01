import { User } from "@prisma/client";
import { prismaClient } from "../../prisma/client";

const prisma = prismaClient;

const UserDAL = {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { email: email },
    });
  },

  async findUnique(username: string): Promise<User | null> {
    return prisma.user.findUnique({where: {username}});
  },

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  },

  async createUser(username: string, email: string, hashedPassword: string): Promise<User> {
    return prisma.user.create({
      data: {
        username,
        email,
        authentications: {
          create: {
            type: 'email',
            identifier: email,
            password_hash: hashedPassword,
          },
        },
      },
    });
  },

  async updateUser(userId: string, data: any): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  },

  async findUserByGoogleId(googleId: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        authentications: {
          some: {
            type: 'google',
            identifier: googleId,
          },
        },
      },
    });
  },

  async createUserWithGoogle(profile: any): Promise<User> {
    const username = profile.displayName.replace(/\s+/g, '');
    const googleId = profile.id;
    const email = profile.emails[0].value;
  
    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        authentications: {
          create: {
            type: 'google',
            identifier: googleId,
          },
        },
      },
    });
    return user;
  },

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async hasEmailAuthentication(userId: string): Promise<boolean> {
    const auth = await prisma.authentication.findFirst({
      where: {
        user_id: userId,
        type: 'email',
      },
    });
    return !!auth;
  },

  async addEmailAuthentication(userId: string, email: string, hashedPassword: string): Promise<void> {
    // Vérifier si une authentification email existe déjà pour cet email
    const existing = await prisma.authentication.findFirst({
      where: {
        type: 'email',
        identifier: email,
      },
    });
  
    if (existing) {
      // L'authentification email existe déjà.
      // Vous pouvez décider de lever une erreur ou de ne rien faire.
      //throw new Error('Une authentification email existe déjà pour cet utilisateur.');
      
      // Si votre logique suppose qu'il faut juste ne rien faire :
      return;
    }
  
    // Sinon, créer l'authentification
    await prisma.authentication.create({
      data: {
        user_id: userId,
        type: 'email',
        identifier: email,
        password_hash: hashedPassword,
      },
    });
  },

  async hasGoogleAuthentication(userId: string): Promise<boolean> {
    const auth = await prisma.authentication.findFirst({
      where: {
        user_id: userId,
        type: 'google',
      },
    });
    return !!auth;
  },

  async addGoogleAuthentication(userId: string, googleId: string): Promise<void> {
    await prisma.authentication.create({
      data: {
        user_id: userId,
        type: 'google',
        identifier: googleId,
      },
    });
  }

};

export default UserDAL;