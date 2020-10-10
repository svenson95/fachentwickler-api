const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLBASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const ExamDate = connection.model('exam-dates', new mongoose.Schema({
    date: { type: String, required: true },
    subject: { type: String, required: true },
    title: { type: String, required: true }
}));

module.exports = ExamDate;
