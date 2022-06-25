import mongoose from 'mongoose';
import { schoolbase } from '../helper/mongodb.interface';

const ExamDateSchema = new mongoose.Schema({
  date: { type: String, required: true },
  subject: { type: String, required: true },
  title: { type: String, required: true },
  lessons: [{ type: String, required: true }],
});

const ExamDates = schoolbase.model('exam-dates', ExamDateSchema);

export = ExamDates;
