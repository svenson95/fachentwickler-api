import { schoolbase } from '../helper/mongodb.interface';

import mongoose from 'mongoose';
import Posts from './Posts';
import Topics from './Topics';
import { SubjectUnpopulated } from '../types/subject';
import { PostElementType } from '../types/post';

const SubjectScheme = new mongoose.Schema({
  subject: { type: String, required: true },
  description: [
    {
      type: {
        type: String,
        enum: PostElementType,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: Topics }],
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: Posts }],
});

const Subjects = schoolbase.model('school-subjects', SubjectScheme);

export = Subjects;
