import mongoose from 'mongoose';
import { postimages } from '../helper/mongodb.interface';

const PhotoFileSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  length: { type: Number, required: true },
  chunkSize: { type: Number, required: true },
  uploadDate: { type: Date, required: true },
  filename: { type: String, required: true },
  md5: { type: String, required: true },
  contentType: { type: String, required: true },
});

const PhotoFiles = postimages.model('photos.files', PhotoFileSchema);

export = PhotoFiles;
