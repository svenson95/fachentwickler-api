const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLBASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const News = connection.model('school-news', new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    url: { type: String, required: true },
    content: { type: Array, required: true }
}));

module.exports = News;
