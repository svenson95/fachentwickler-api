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

// Database Connection
mongoose.connect(process.env.DB_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("Connection successful!");
});

// Start listening to the server
app.listen(3000);
