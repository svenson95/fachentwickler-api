const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SUBJECTS);
const LF2_Subject = connection.model('lf-2', new mongoose.Schema({
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

module.exports = LF2_Subject;
