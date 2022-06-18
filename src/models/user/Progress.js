const mongoose = require('mongoose');

const Progress = mongoose.schoolusers.model(
  'progress',
  new mongoose.Schema({
    userId: { type: String },
    postId: { type: String },
  }),
);

module.exports = Progress;
