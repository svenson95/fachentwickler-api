const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLBASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const Subject = connection.model('school-subjects', new mongoose.Schema({
    subject: { type: String, required: true },
    topics: { type: Array, default: [
        {
            title: {
                type: String, required: true
            },
            links: Array, default: [{
                title: String,
                description: String,
                url: String,
                topic: String,
                elements: [{
                    type: {
                        type: String,
                        required: true
                    },
                    content: {
                        type: String,
                        required: true
                    },
                    list: {
                        type: Array,
                        default: [
                            {
                                type: String
                            }
                        ]
                    }
                }]
            }]
        }
    ]},
    tests: { type: Array, required: false, default: null}
}));

module.exports = Subject;
