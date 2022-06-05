const mongoose = require('../../middleware/mongoose');

const ExamDate = mongoose.schoolbase.model(
  'exam-dates',
  new mongoose.Schema({
    date: { type: String, required: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
    lessons: { type: Array, required: true },
  }),
);

module.exports = ExamDate;
