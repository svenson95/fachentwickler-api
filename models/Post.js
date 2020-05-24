const mongoose = require('mongoose');
const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    elements: {
        type: Array,
        default: [
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
                    default: [
                        {
                            type: String,
                            required: true
                        }
                    ]
                }
            }
        ]
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('lf-2', PostSchema);
