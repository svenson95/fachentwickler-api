const mongoose = require('mongoose');

const News = mongoose.schoolbase.model(
  'school-news',
  new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    url: { type: String, required: true },
    content: { type: Array, required: true },
  }),
);

module.exports = News;
