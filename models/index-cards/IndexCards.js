const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLBASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const IndexCards = connection.model('index-cards', new mongoose.Schema({
    url: { type: String, required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    schoolWeek: { type: String, required: true },
    lessonDate: { type: String, required: true },
    lastUpdate: { type: String, required: true },
    questions: { type: Array, default: [
        {
            question: { type: String, required: true },
            answer: { type: Number, required: true }
        }
    ]}
}));

module.exports = IndexCards;
