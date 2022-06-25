import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

import { MongoDBInterface } from './src/helper/mongodb.interface';
import { info, error } from './src/helper/logging';
import postsRouter from './src/routes/posts';
import examdatesRouter from './src/routes/exam-date';
import schoolweekRouter from './src/routes/school-week';
import imagesRouter from './src/routes/images';
import newsRouter from './src/routes/news';
import searchRouter from './src/routes/search';
import subjectsRouter from './src/routes/subjects';
import topicsRouter from './src/routes/topics';
import userRouter from './src/routes/user';

const mongoDBInterface = new MongoDBInterface();
const whitelist = ['http://206.189.53.246', 'http://localhost:4200'];

async function start(): Promise<void> {
  info('Start service...');

  /* Middleware */
  const app = express();
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(
    cors({
      origin(origin: any, callback: Function) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      methods: ['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      optionsSuccessStatus: 200,
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'device-remember-token',
        'Access-Control-Allow-Origin',
        'Origin',
        'Accept',
      ],
    }),
  );
  await mongoDBInterface.connect();

  /* Routes */
  app.use('/posts', postsRouter);
  app.use('/topics', topicsRouter);
  app.use('/subjects', subjectsRouter);
  app.use('/images', imagesRouter);
  app.use('/search', searchRouter);
  app.use('/user', userRouter);
  app.use('/exam-dates', examdatesRouter);
  app.use('/school-week', schoolweekRouter);
  app.use('/news', newsRouter);

  app.listen(3000, () => {
    info('Listening on port 3000.');
  });
}

start().catch((err) => {
  error(err);
});

process.on('SIGINT', () => {
  info("Received system signal 'SIGINT'. Shutting down service...");
  mongoDBInterface.disconnect();
  // exit(0);
});

process.on('SIGTERM', () => {
  info("Received system signal 'SIGTERM'. Shutting down service...");
  mongoDBInterface.disconnect();
  // exit(0);
});
