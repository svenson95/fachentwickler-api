const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_POSTS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const List = connection.model('list', new mongoose.Schema({
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

module.exports = List;
