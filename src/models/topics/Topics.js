const mongoose = require('../../middleware/mongoose');
const Post = require('../posts/Posts');

const Topics = mongoose.schoolbase.model(
  'topics',
  new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    subject: { type: String, required: true },
    links: [{ type: mongoose.Schema.Types.ObjectId, ref: Post }],
  }),
);

module.exports = Topics;
