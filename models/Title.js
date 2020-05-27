const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_POSTS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const TitlesSchema = connection.model('postsTitles', new mongoose.Schema({
    subject: { type: String },
    topics: { type: Array, required: true, default: [
        {
            type: Object
        }
    ]},
    tests: { type: Array, default: [
        { type: Object },
    ]}
}));

module.exports = TitlesSchema;
