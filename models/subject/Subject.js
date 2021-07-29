const mongoose = require('mongoose');
const Topic = require('../topics/Topics');
const Post = require('../posts/Posts');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLBASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const Subject = connection.model('school-subjects', new mongoose.Schema({
    subject: { type: String, required: true },
    description: { type: Array, required: true },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: Topic }],
    tests: [{ type: mongoose.Schema.Types.ObjectId, ref: Post }]
}));

module.exports = Subject;
