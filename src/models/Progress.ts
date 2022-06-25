import { schoolusers } from '../helper/mongodb.interface';
import mongoose from 'mongoose';

const ProgressScheme = new mongoose.Schema({
  userId: { type: String },
  postId: { type: String },
});

const Progress = schoolusers.model('progress', ProgressScheme);

export = Progress;
