const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { MongoDBInterface } = require('./src/helper/mongodb.interface');
const { info, error } = require('./src/helper/logging');

const mongoDBInterface = new MongoDBInterface();
const whitelist = ['http://206.189.53.246', 'http://localhost:4200'];

async function start() {
  info('Start service...');

  /* Middleware */
  const app = express();
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
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
  /* eslint-disable global-require */
  app.use('/posts', require('./src/routes/posts'));
  app.use('/topics', require('./src/routes/topics'));
  app.use('/subjects', require('./src/routes/subjects'));
  app.use('/images', require('./src/routes/images'));
  app.use('/search', require('./src/routes/search'));
  app.use('/user', require('./src/routes/user'));
  app.use('/exam-dates', require('./src/routes/exam-date'));
  app.use('/school-week', require('./src/routes/school-week'));
  app.use('/news', require('./src/routes/news'));

  app.listen(3000, () => {
    info('Listening on port 3000.');
  });
}

start().catch((err) => {
  error(err);
});

process.on('SIGINT', async () => {
  info("Received system signal 'SIGINT'. Shutting down service...");
  await mongoDBInterface.disconnect();
  // exit(0);
});

process.on('SIGTERM', async () => {
  info("Received system signal 'SIGTERM'. Shutting down service...");
  await mongoDBInterface.disconnect();
  // exit(0);
});
