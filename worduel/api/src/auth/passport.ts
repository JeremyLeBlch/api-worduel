import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import UserDAL from '../data/user/userDAL';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser(function(user: any, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id: string, done) {
  try {
    const user = await UserDAL.findUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use('google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.NODE_ENV === 'production'
        ? process.env.GOOGLE_CALLBACK_URL_REGISTER_PROD
        : process.env.GOOGLE_CALLBACK_URL_REGISTER_DEV,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {

        let stateUserId: string | undefined;
        let stateGoogleId: string | undefined;

        if (req.query.state) {
          const state = JSON.parse(decodeURIComponent(req.query.state as string));
          stateUserId = state.userId;
          stateGoogleId = state.googleId;
        }

        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const googleId = profile.id;

        if (!email) {
          return done(new Error("Pas d'email renvoyée par Google."), null);
        }

        const userByGoogle = await UserDAL.findUserByGoogleId(googleId);
        if (userByGoogle) {
          return done(null, userByGoogle);
        }

        // Étape 2 : Vérifier si un compte email existe déjà
        const userByEmail = await UserDAL.findUserByEmail(email);
        if (userByEmail) {
          // Stockez les informations dans req
          req.linkAccount = { userId: userByEmail.id, googleId };
          return done(null, false);
        }

        // Étape 3 : Créer un nouvel utilisateur avec Google
        const newUser = await UserDAL.createUserWithGoogle(profile);
        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
