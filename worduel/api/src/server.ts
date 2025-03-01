import { app, typeDefs, resolvers } from "./app";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { MyContext } from "./types/context";
import { prismaClient } from "./prisma/client";
import authRoutes from "./routes/authRoutes";
import passport from "./auth/passport";
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middlewares/authMiddleware';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
//import csurf from 'csurf';

const prisma = prismaClient;
const pubSub = new PubSub();

// Déterminer l'environnement
const isProduction = process.env.NODE_ENV === 'production';

// Étendre l'interface Express Request pour inclure csrfToken()
declare global {
  namespace Express {
    interface Request {
      csrfToken(): string;
    }
  }
}

export async function startServer() {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // Appliquer le middleware d'authentification
  const schemaWithMiddleware = applyMiddleware(schema, authMiddleware);

  const server = new ApolloServer<MyContext>({
    schema: schemaWithMiddleware,
    introspection: true,
  });

  await server.start();

  app.use(cookieParser());
  app.use(passport.initialize());

  app.use(authRoutes);

  // Configurer csurf avant le middleware GraphQL
  // app.use(
  //   csurf({
  //     cookie: {
  //       httpOnly: true,
  //       secure: isProduction, // 'true' en production, 'false' en développement
  //       sameSite: 'strict',
  //     },
  //     value: (req) => {
  //       return req.headers['x-csrf-token'] as string;
  //     },
  //   })
  // );

  // // Route pour récupérer le token CSRF
  // app.get('/csrf-token', (req, res) => {
  //   res.send({ csrfToken: req.csrfToken() });
  // });

  // // Gérer les erreurs CSRF
  // app.use((err, req, res, next) => {
  //   if (err.code !== 'EBADCSRFTOKEN') return next(err);
  //   res.status(403);
  //   res.send({ error: 'Formulaire invalide (CSRF détecté)' });
  // });

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<MyContext> => {
        const user = (req as any).user || null;
        const forwarded = req.headers['x-forwarded-for'];
        const ip = typeof forwarded === 'string'
          ? forwarded.split(',')[0].trim()
          : Array.isArray(forwarded)
            ? forwarded[0]
            : req.socket.remoteAddress || req.ip;

        return { user, prisma, res, ip, req, pubSub };
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  const httpServer = createServer(app);

  // Création du serveur WebSocket pour graphql-ws
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Brancher graphql-ws au schéma
  useServer({ schema: schemaWithMiddleware, context: () => ({ prisma, pubSub }) }, wsServer);


  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) => {
  console.error("Erreur lors du démarrage du serveur:", error);
});
