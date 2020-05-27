const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SUBJECTS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const LF1_Subject = connection.model('lf-1', new mongoose.Schema({
    subject: { type: String, required: true },
    topics: { type: Array, default: [
        {
            title: {
                type: String, required: true
            },
            links: Array, default: [
                { title: String, required: true },
                { description: String, required: true },
                { url: String, required: true },
            ]
        }
    ]},
    tests: { type: Array, required: false, default: [
            { title: String, required: true },
            { description: String, required: true },
            { url: String, required: true },
    ]}
}));

module.exports = LF1_Subject;
