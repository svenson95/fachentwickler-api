const mongoose = require('mongoose');
const Post = require('../posts/Posts');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLBASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const Topics = connection.model('topics', new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    subject: { type: String, required: true },
    links: [
        { type: mongoose.Schema.Types.ObjectId, ref: Post }
    ]
}));

module.exports = Topics;
