const mongoose = require('mongoose');
const User = require('./User');

const progressSchema = new mongoose.Schema({
    author: {
        type: User,
        default: null
    },
    name: {
        type: String,
        required: true
    }
});

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLUSERS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const Progress = connection.model('Progress', progressSchema, 'progress');

module.exports = Progress;
