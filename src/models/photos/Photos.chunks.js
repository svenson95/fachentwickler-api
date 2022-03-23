const mongoose = require('../../middleware/mongoose');

const PhotoChunks = mongoose.schoolfiles.model('photos.chunks', new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    files_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    image_file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GridFs'
    }
}));

module.exports = PhotoChunks;
