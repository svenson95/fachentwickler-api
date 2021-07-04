const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require("helmet");
require('dotenv/config');

const whitelist = ['http://159.65.105.150', 'http://localhost:4200']
const app = express();

/* Middleware */
app.use(bodyParser.json());
app.use(cors({
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    methods: ['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
}));

/**
 * Helmet helps you secure your Express apps by setting various HTTP headers.
 */
app.use(helmet())

/* Routes */
app.use('/quiz', require('./routes/quiz'));
app.use('/matching', require('./routes/matching'));
app.use('/posts', require('./routes/posts'));
app.use('/index-cards', require('./routes/index-cards'));
app.use('/search', require('./routes/search'));
app.use('/topics', require('./routes/topics'));
app.use('/subjects', require('./routes/subjects'));
app.use('/images', require('./routes/images'));
app.use('/user', require('./routes/user'));
app.use('/exam-dates', require('./routes/exam-date'));
app.use('/school-week', require('./routes/school-week'));
app.use('/news', require('./routes/news'));

// Start listening to the server
app.listen(3000);
