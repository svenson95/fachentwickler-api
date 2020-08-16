const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_SCHOOLBASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const LF5_Post = connection.model('lf-9-posts', new mongoose.Schema({
    url:            { type: String, required: true },
    topic:          { type: String, required: true},
    elements:       { type: Array, default: [
            {
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
                    required: false,
                    default: [
                        {
                            type: String,
                            required: true
                        }
                    ]
                },
            }
        ]}
}));

module.exports = LF5_Post;
