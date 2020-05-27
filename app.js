const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

// Middleware - enabled CORS from every origin
app.use(bodyParser.json());
app.use(cors());

// Import routes
app.use('/posts', require('./routes/posts'));
app.use('/subjects', require('./routes/subjects'));

// Routes
app.get('/', (req, res) => {
    res.send('start page');
});

// Start listening to the server
app.listen(3000);
