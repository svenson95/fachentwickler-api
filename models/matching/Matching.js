const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLBASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const Matching = connection.model('matching', new mongoose.Schema({
    url: { type: String, required: true },
    topicId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    type: { type: String, required: true },
    lessonDate: { type: String, required: true },
    lastUpdate: { type: String, required: true },
    schoolWeek: { type: String, required: true },
    pairs: { type: Array }
}));

module.exports = Matching;
