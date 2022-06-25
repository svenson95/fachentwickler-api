import { schoolbase } from '../helper/mongodb.interface';
import mongoose from 'mongoose';
import { PostElementType } from '../types/post';

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  url: { type: String, required: true },
  content: [
    {
      type: {
        type: String,
        enum: PostElementType,
        required: true,
      },
    },
  ],
});

const News = schoolbase.model('school-news', NewsSchema);

export = News;
