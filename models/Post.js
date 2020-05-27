const mongoose = require('mongoose');
const PostSchema = mongoose.Schema({
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
});

module.exports = mongoose.model('lf-2', PostSchema);
