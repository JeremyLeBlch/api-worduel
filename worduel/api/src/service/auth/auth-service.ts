import jwt from 'jsonwebtoken';
import {validateEmail, validatePassword, validateUsername} from "../../../utils/validators";
import {SECRET_KEY} from "../../config/env";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client"
import UserDAL from "../../data/user/userDAL";
import {prismaClient} from "../../prisma/client";

const prisma = prismaClient;

async function generateUniqueUsername(): Promise<string> {
  let username: string;
  let isUnique = false;

  while (!isUnique) {
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    username = `Player${randomNumber}`;

    const existingUser = await UserDAL.findUnique(username);
    if (!existingUser) {
      isUnique = true;
    }
  }
  return username;
}

const AuthService = {
  async registerUser(email: string, password: string, username?: string): Promise<User> {
    validateEmail(email);
    validatePassword(password);

    const existingUser = await UserDAL.findUserByEmail(email);
    if (existingUser) {
      const hasGoogleAuth = await UserDAL.hasGoogleAuthentication(existingUser.id);
      if (hasGoogleAuth) {
        const hasEmailAuth = await UserDAL.hasEmailAuthentication(existingUser.id);
        if (hasEmailAuth) {
          // Email/password existe déjà
          throw new Error('Cet email est déjà utilisé.');
        } else {
          // Ici, l'utilisateur existe avec Google mais pas email/password.
          // On NE crée PAS l'authentification email ici.
          // On lève une erreur "Veuillez le lier." afin que le frontend affiche la page ConfirmLinkGoogle.
          throw new Error('Un compte avec cet email existe déjà via Google. Veuillez le lier.');
        }
      } else {
        // L'utilisateur existe déjà en email/password
        throw new Error('Cet email est déjà utilisé.');
      }
    }

    // Aucun utilisateur n'existe, on crée un nouvel utilisateur
    if (!username) {
      username = await generateUniqueUsername();
    } else {
      validateUsername(username);
      const existingUsername = await UserDAL.findUnique(username);
      if (existingUsername) {
        throw new Error('Ce nom d\'utilisateur est déjà utilisé');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return UserDAL.createUser(username, email, hashedPassword);
  },

  async authenticateUser(email: string, password: string): Promise<User> {
    const user = await UserDAL.findUserByEmail(email);
    if (!user) throw new Error('Email ou mot de passe incorrect');
  
    // Récupére l'authentification correspondante
    const auth = await prisma.authentication.findFirst({
      where: {
        user_id: user.id,
        type: 'email',
      },
    });
  
    if (!auth || !auth.password_hash) throw new Error('Méthode d\'authentification non valide');
  
    const valid = await bcrypt.compare(password, auth.password_hash);
    if (!valid) throw new Error('Email ou mot de passe incorrect');
  
    return user;
  },

  generateToken(user: User) {
    return jwt.sign({userId: user.id, role: user.role}, SECRET_KEY, {expiresIn: '8h'});
  },

  comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  },
};

export default AuthService;