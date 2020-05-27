const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_POSTS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const PostTitles = connection.model('postsTitles', new mongoose.Schema({
    subject: { type: String, required: true },
    topics: { type: Array, default: [
        {
            title: String,
            links: { type: Array, default: [
                { title: String, description: String, url: String }
            ]}
        }
    ]},
    tests: { type: Array, default: [
        { title: String, description: String, url: String }
    ]}
}));

module.exports = PostTitles;
