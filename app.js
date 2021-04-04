const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

// Middleware - enabled CORS from every origin
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    credentials: true, origin: true
}));

// Import routes
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
app.use('/substitution-schedule', require('./routes/substitution-schedule'));
app.use('/school-week', require('./routes/school-week'));
app.use('/news', require('./routes/news'));

// Routes
app.get('/', (req, res) => {
    res.send('start page');
});

// Start listening to the server
app.listen(3000);
