import mongoose from 'mongoose';
import { schoolbase } from '../helper/mongodb.interface';
import Posts from './Posts';

const TopicScheme = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  subject: { type: String, required: true },
  links: [{ type: mongoose.Schema.Types.ObjectId, ref: Posts }],
});

const Topics = schoolbase.model('topics', TopicScheme);

export = Topics;
