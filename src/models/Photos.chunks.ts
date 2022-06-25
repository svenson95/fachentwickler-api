import mongoose from 'mongoose';
import { postimages } from '../helper/mongodb.interface';

const PhotoChunkSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  files_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  image_file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GridFs',
  },
});

const PhotoChunks = postimages.model('photos.chunks', PhotoChunkSchema);

export = PhotoChunks;
