import express, { Request, Response } from 'express';
import passport from '../auth/passport';
import dotenv from 'dotenv';
import AuthService from '../service/auth/auth-service';
import UserDAL from '../data/user/userDAL';
import { prismaClient } from '../prisma/client';
import { GraphQLError } from "graphql";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserService from '../service/user/user-service';
import { sendResetPasswordEmail } from '../service/email/emailService';

dotenv.config();

const prisma = prismaClient;

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'defaultsecret';
const RESET_TOKEN_EXPIRATION = '1h';

// Route pour initier l'authentification Google avec state
router.get('/auth/google', (req, res, next) => {
  const userId = req.query.userId as string | undefined;
  const googleId = req.query.googleId as string | undefined;

  let stateObj = {};
  if (userId && googleId) {
    stateObj = { userId, googleId };
  }
  const stateString = encodeURIComponent(JSON.stringify(stateObj));

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: stateString,
  })(req, res, next);
});

// Callback après authentification
router.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err) return next(err);

    if (user) {
      const token = AuthService.generateToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000,
      });

      let redirectTo: string;
      if (req.query.state) {
        const state = JSON.parse(decodeURIComponent(req.query.state as string));
        if (state.userId && state.googleId) {
          redirectTo = `${process.env.FRONTEND_URL}/link-email-success`;
        } else {
          redirectTo = process.env.NODE_ENV === 'production'
            ? process.env.RES_REDIRECT_URL_LOGIN_PROD!
            : process.env.RES_REDIRECT_URL_LOGIN_DEV!;
        }
      } else {
        redirectTo = process.env.NODE_ENV === 'production'
          ? process.env.RES_REDIRECT_URL_LOGIN_PROD!
          : process.env.RES_REDIRECT_URL_LOGIN_DEV!;
      }

      res.redirect(redirectTo);
    } else if ((req as any).linkAccount) {
      const { userId, googleId } = (req as any).linkAccount;
      res.redirect(`${process.env.FRONTEND_URL}/confirm-link-account?userId=${userId}&googleId=${googleId}`);
    } else {
      res.redirect('/connexion');
    }
  })(req, res, next);
});

// Route pour traiter la confirmation de liaison
router.post('/confirm-link-account', async (req, res) => {
  const { userId, googleId, password } = req.body;

  // Vérifie que l'utilisateur existe
  const user = await UserDAL.findUserById(userId);
  if (!user) {
    return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  // Vérifie le mot de passe
  const auth = await prisma.authentication.findFirst({
    where: {
      user_id: userId,
      type: 'email',
    },
  });

  if (!auth || !auth.password_hash) {
    return res.status(400).json({ message: 'Méthode d\'authentification non valide' });
  }

  const valid = await AuthService.comparePassword(password, auth.password_hash);
  if (!valid) {
    return res.status(400).json({ message: 'Mot de passe incorrect' });
  }

  // Ajoute la méthode Google
  await UserDAL.addGoogleAuthentication(user.id, googleId);

  // Connecte l’utilisateur
  const token = AuthService.generateToken(user);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  });

  // Retourne une réponse JSON indiquant le succès
  res.status(200).json({ message: 'Compte lié avec succès' });
});


router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const user = await AuthService.registerUser(email, password, username);
    const token = AuthService.generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    });
    return res.status(201).json({ message: 'Inscription réussie.' });
  } catch (err: any) {
    if (err.message.includes('Veuillez le lier')) {
      const existingUser = await UserDAL.findUserByEmail(email);
      const googleAuth = await prisma.authentication.findFirst({
        where: { user_id: existingUser.id, type: 'google' },
      });
    }

    throw new GraphQLError(err.message, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
});

router.post('/confirm-link-email', async (req: Request, res: Response) => {
  const { userId, email, password } = req.body;

  if (!userId || !email || !password) {
    return res.status(400).json({ message: 'Paramètres manquants.' });
  }

  // Vérifie que l'utilisateur existe
  const user = await UserDAL.findUserById(userId);
  if (!user) {
    return res.status(400).json({ message: 'Utilisateur non trouvé.' });
  }

  // Vérifie qu'il a déjà une authentification Google
  const hasGoogleAuth = await UserDAL.hasGoogleAuthentication(userId);
  if (!hasGoogleAuth) {
    return res.status(400).json({ message: 'Aucune authentification Google trouvée pour cet utilisateur.' });
  }

  // Vérifie qu'il n'a pas déjà une auth email
  const hasEmailAuth = await UserDAL.hasEmailAuthentication(userId);
  if (hasEmailAuth) {
    return res.status(400).json({ message: 'Une authentification email existe déjà.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await UserDAL.addEmailAuthentication(userId, email, hashedPassword);

  return res.status(200).json({ message: 'Authentification email ajoutée avec succès.' });
});

router.post('/request-reset-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email requis.' });
  }

  const user = await UserDAL.findUserByEmail(email);
  if (!user) {
    return res.status(200).json({ message: 'Si cet email existe, un lien sera envoyé.' });
  }

  const resetToken = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: RESET_TOKEN_EXPIRATION });
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    await sendResetPasswordEmail(email, resetLink);
    res.status(200).json({ message: 'Un email a été envoyé avec les instructions pour réinitialiser le mot de passe.' });
  } catch (err) {
    console.error('Erreur lors de l\'envoi de l\'email:', err);
    res.status(500).json({ message: 'Erreur interne. Impossible d\'envoyer l\'email.' });
  }
});

// Route pour réinitialiser le mot de passe
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token et nouveau mot de passe requis.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };

    await UserService.updateUser(decoded.userId, { password: newPassword }, prisma);

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    res.status(400).json({ message: 'Jeton invalide ou expiré.' });
  }
});

export default router;