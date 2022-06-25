import mongoose from 'mongoose';
import { schoolbase } from '../helper/mongodb.interface';
import { PostElementType } from '../types/post';

const PostSchema = new mongoose.Schema({
  url: { type: String, required: true },
  topicId: { type: String, required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, required: true },
  lessonDate: { type: String, required: true },
  lastUpdate: { type: String, required: true },
  schoolWeek: { type: Number, required: true },
  elements: [
    {
      type: {
        type: String,
        enum: PostElementType,
        required: true,
      },
    },
  ],
});

const Posts = schoolbase.model('subjects-posts', PostSchema);

export = Posts;
