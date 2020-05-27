const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_POSTS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", function() {
    console.log("Connection successful!");
});

const List = connection.model('list', new mongoose.Schema({
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

module.exports = List;
