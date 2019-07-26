import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import upload from 'express-fileupload';
import log4js from 'log4js';

import typeDefs from './database/graphql/schemes';
import resolvers from './database/graphql/resolvers';

import { development, production } from '../config';

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
const config = env === 'production' ? production : development;

import models from './database/models';

import homeRouter from './routes/home';
import authRouter from './routes/auth';

import articleApiRouter from './routes/api/article';
import commentApiRouter from './routes/api/comment';
import keyWordApiRouter from './routes/api/keyWord';

const app = express();
//load passport strategies
require('./passport')(passport, models.user);

const graphQlInit = () => {
  const server = new ApolloServer({
    typeDefs: gql(typeDefs),
    resolvers,
    context: { db: models }
  });

  server.applyMiddleware({ app, path: '/ql' });
}

const passportInit = () => {
  app.use(cookieParser('punks_not_dead'));

  const oneHour = 3600000;
  app.use(session({
    secret: 'punks_not_dead',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: new Date(Date.now() + oneHour),
      expires: new Date(Date.now() + oneHour)
    }
  }));
  app.use(passport.initialize());
  app.use(passport.session());
};

const routeInit = () => {
  app.use('/', homeRouter);
  app.use('/', authRouter);
  app.use('/api/', articleApiRouter);
  app.use('/api/', commentApiRouter);
  app.use('/api/', keyWordApiRouter);
};

const corsInit = () => {
  //CORS middleware
  const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
  };
  app.use(allowCrossDomain);
};

const parserRequsetInit = () => {
  app.use(upload());
  app.use(bodyParser.urlencoded({ extended: true, limit: '3mb' }));
  app.use(bodyParser.json({ limit: '3mb' }));
};

const appInit = () => {
  corsInit();
  parserRequsetInit();
  passportInit();

  routeInit();

  graphQlInit();
};

appInit();

const logger = log4js.getLogger();
logger.level = 'debug';

global.APP = {
  log: (msg) => config.debug ? console.log(msg) : null
};
APP.log.debug = (msg) => config.debug ? logger.debug(msg) : null;
APP.log.trace = (msg) => config.debug ? logger.trace(msg) : null;
APP.log.info = (msg) => config.debug ? logger.info(msg) : null;
APP.log.warn = (msg) => config.debug ? logger.warn(msg) : null;
APP.log.error = (msg) => config.debug ? logger.error(msg) : null;
APP.log.fatal = (msg) => config.debug ? logger.fatal(msg) : null;

const defaultPort = 5000;
const port = process.env.PORT || defaultPort;

models.sequelize.sync().then(function() {
  console.log('NODE_ENV:', env);

  app.listen(port, () => console.log(`Listening on port ${port}`));

  console.log('Nice! Database looks fine');
}).catch(function(err) {
  console.log(err, 'Something went wrong with the Database Update!');
});

