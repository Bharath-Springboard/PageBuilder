import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import Redis from 'ioredis';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Course } from './app/entities/Course';
import { Mentor } from './app/entities/Mentor';
import { Student } from './app/entities/Student';
import { StudentProgress } from './app/entities/StudentProgress';
import { StudentResolver } from './app/resolvers/StudentResolver';
import { MentorResolver } from './app/resolvers/MentorResolver';
import { CourseResolver } from './app/resolvers/CourseResolver';

const main = async () => {
  createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'bharathchandra',
    database: 'bharathchandra',
    ssl: false,
    /* extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    }, */
    //logging: true, // False in production
    synchronize: true, // False in production environment
    entities: [Course, Mentor, Student, StudentProgress],
    //url: process.env.HEROKU_POSTGRESQL_CRIMSON_URL,
  });

  // Setup expres server
  const app = express();

  // create application/json parser
  const jsonParser = bodyParser.json();

  // Redis Client
  const redis = new Redis({
    host: process.env.REDIS_DB_HOST,
    password: process.env.REDIS_DB_PASSWORD || '',
    port: parseInt(process.env.REDIS_DB_PORT ? process.env.REDIS_DB_PORT : ''),
  });

  // Redis store
  const redisStore = connectRedis(session);

  app.set('trust proxy', 1);

  // cors
  const corsOptions = {
    origin: [
      process.env.WEB_APP_URL || '',
      'http://localhost:4201',
      'https://studio.apollographql.com',
    ],
    credentials: true, // <-- REQUIRED backend setting
  };

  // set cors
  app.use(cors(corsOptions));

  // Redis session
  app.use(
    session({
      name: process.env.COOKIE_NAME,
      // eslint-disable-next-line new-cap
      store: new redisStore({
        client: redis,
        disableTouch: true, // Need it alive forever, need not reset based on user behaviour
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: true, //cookie only in https
        sameSite: 'none',
        //domain: __PROD__ ? process.env.COOKIE_DOMAIN : undefined,
      },
      saveUninitialized: false,
      secret: process.env.REDIS_SESSION_SECRET || '',
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [StudentResolver, MentorResolver, CourseResolver],
      dateScalarMode: 'isoDate',
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });

  // Start apolloServer
  await apolloServer.start();

  // Apply to express middleware
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(parseInt(process.env.PORT || ''), () => {
    console.log('Server is up !!');
  });
};

main().catch((error) => {
  console.log('Main Error ==> ', error);
});
