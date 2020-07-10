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
app.use('/posts', require('./routes/posts'));
app.use('/subjects', require('./routes/subjects'));
app.use('/images', require('./routes/images'));
app.use('/user', require('./routes/user'));

// Routes
app.get('/', (req, res) => {
    res.send('start page');
});

// Start listening to the server
app.listen(3000);
