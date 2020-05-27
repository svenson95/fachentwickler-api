const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_POSTS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const Posts = connection.model('postsTitles', new mongoose.Schema({
    subject: { type: String },
    topics: { type: Array, default: [
            {
                title: {
                    type: String, required: true
                },
                links: Array, default: [
                    { title: String, description: String, url: String }
                ]
            }
        ]},
    tests: { type: Array, required: false, default: [
            { title: String, description: String, url: String }
    ]}
}));

module.exports = Posts;
