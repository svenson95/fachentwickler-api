const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: { type: String },
    unitId: { type: String }
});

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLUSERS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const Progress = connection.model('Progress', progressSchema, 'progress');

module.exports = Progress;
