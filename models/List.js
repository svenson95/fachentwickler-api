const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_POSTS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", function() {
    console.log("Connection successful! 3");
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
