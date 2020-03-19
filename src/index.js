// Package Imports
import express from 'express';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { ApolloServer } from 'apollo-server-express'

import typeDefs from './typeDefs'
import resolvers from './resolvers';
import schemaDirectives from './guards';

// Constants
import {
    DB,
    IN_PORD,
    APP_PORT,
    REDIS_HOST,
    REDIS_PORT,
    SESSION_NAME,
    REDIS_PASSWORD,
    SESSION_SECRET,
    SESSION_LIFETIME,
} from './config';


const app = express();

// Create Redis Store
const RedisStore = connectRedis(session);

const redisClient = createClient();

const store = new RedisStore({
    host: REDIS_HOST,
    port: REDIS_PORT,
    pass: REDIS_PASSWORD,
    client: redisClient,
});

app.disable('x-powered-by');
app.use(session(
    {
        store,
        saveUninitialized: false,
        secret: SESSION_SECRET,
        name: SESSION_NAME,
        rolling: true,
        resave: true,
        cookie: {
            maxAge: parseInt(SESSION_LIFETIME),
            sameSite: true,
            secure: IN_PORD
        }
    }
));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    playground: IN_PORD ? false : {
        settings: {
            'request.credentials': 'include'
        }
    },
    context: ({ req, res }) => ({ req, res })
});

const startApp = async () => {
    try {
        // Database Connection
        await mongoose.connect(DB, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`Successfully connected to the Database ${DB}`);
        server.applyMiddleware({ app, cors: false });
        app.listen({ port: APP_PORT }, () =>
            console.log(`Server started on port http://localhost:${APP_PORT}${server.graphqlPath}`)
        );
    } catch (err) {
        console.error(err);
    }
}

startApp();