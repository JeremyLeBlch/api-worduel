//import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, Observable } from '@apollo/client';
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';

const allowedOrigin = import.meta.env.NODE_ENV === 'production'
  ? import.meta.env.VITE_API_URL_PROD
  : import.meta.env.VITE_API_URL_DEV_2;

// const allowedOriginCRSF = import.meta.env.NODE_ENV === 'production'
//   ? import.meta.env.VITE_API_URL_PROD_CRSF
//   : import.meta.env.VITE_API_URL_DEV_CRSF;

// function getCsrfToken() {
//   return fetch(allowedOriginCRSF, {
//     credentials: 'include',
//   })
//     .then((response) => response.json())
//     .then((data) => data.csrfToken);
// }

// Middleware pour ajouter le token CSRF
// const csrfLink = new ApolloLink((operation, forward) => {
//   return new Observable((observer) => {
//     getCsrfToken()
//       .then((csrfToken) => {
//         operation.setContext(({ headers = {} }) => ({
//           headers: {
//             ...headers,
//             'X-CSRF-Token': csrfToken,
//           },
//         }));
//         return csrfToken;
//       })
//       .then(() => {
//         const subscriber = {
//           next: observer.next.bind(observer),
//           error: observer.error.bind(observer),
//           complete: observer.complete.bind(observer),
//         };
//         forward(operation).subscribe(subscriber);
//       })
//       .catch((error) => {
//         observer.error(error);
//       });
//   });
// });

const httpLink = new HttpLink({
  uri: allowedOrigin,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  // Ajoutez ici si besoin un token ou autre
  return {
    headers: {
      ...headers,
      // Ex: Authorization: `Bearer ${token}`
    },
  };
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
  connectionParams: {
    // Si besoin, passez des informations d'authentification ici
    // exemple:
    headers: {
      ...Headers,
    //   Authorization: `Bearer ${token}`,
    },
  }
}));

// On crée un link final qui sépare entre queries/mutations (http) et subscriptions (ws)
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  // ici on applique l'authLink sur les requêtes non-subscription (http)
  authLink.concat(httpLink)
);

// const client = new ApolloClient({
//   link: csrfLink.concat(httpLink),
//   cache: new InMemoryCache(),
//   connectToDevTools: true,
// });

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default client;
