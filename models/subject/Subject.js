const mongoose = require('mongoose');
const Topic = require('../topics/Topics');
const Post = require('../posts/Posts');
const Quiz = require('../quiz/Quiz');
const IndexCard = require('../index-cards/IndexCards');
const Matching = require('../matching/Matching');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLBASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const Subject = connection.model('school-subjects', new mongoose.Schema({
    subject: { type: String, required: true },
    description: { type: String, required: true },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: Topic }],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: Quiz }],
    indexcards: [{ type: mongoose.Schema.Types.ObjectId, ref: IndexCard }],
    matchings: [{ type: mongoose.Schema.Types.ObjectId, ref: Matching }],
    tests: [{ type: mongoose.Schema.Types.ObjectId, ref: Post }]
}));

module.exports = Subject;
