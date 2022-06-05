const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const mongoose = require('./src/middleware/mongoose');
require('dotenv/config');

// const {
//   changePostTypeValues,
//   changePostImageURLs,
//   changePostSchoolWeekProp,
// } = require("./src/helper/posts");
// const { changeSubjectDescription } = require("./src/helper/subjects");
// const { changeNewsTypeValues } = require("./src/helper/news");

const whitelist = ['http://206.189.53.246', 'http://localhost:4200'];

async function start() {
  console.info('Start service...');

  /* Middleware */
  const app = express();
  // app.use(express.static(path.join(__dirname, '/frontend/build')));
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(
    cors({
      origin: function (origin, callback) {
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
  mongoose.connectToDatabase();

  /* Routes */
  app.use('/posts', require('./src/routes/posts'));
  app.use('/topics', require('./src/routes/topics'));
  app.use('/subjects', require('./src/routes/subjects'));
  app.use('/images', require('./src/routes/images'));
  app.use('/search', require('./src/routes/search'));
  app.use('/user', require('./src/routes/user'));
  app.use('/exam-dates', require('./src/routes/exam-date'));
  app.use('/school-week', require('./src/routes/school-week'));
  app.use('/news', require('./src/routes/news'));

  app.listen(3000, async () => {
    await console.log('Listening on port 3000.');
  });
}

start().catch((err) => {
  console.error(err);
});
