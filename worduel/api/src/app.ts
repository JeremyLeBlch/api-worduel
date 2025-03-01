import express from 'express';

import bodyParser from 'body-parser';
import {corsConfig} from "./config/corsConfig";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

const app = express();


// Middleware CORS, bodyParser, cookies et authentification
app.use(corsConfig);
app.use(bodyParser.json());

export {typeDefs, resolvers, app};