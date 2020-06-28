const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_POSTIMAGES, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const PhotoChunks = connection.model('photos.chunks', new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    files_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    image_file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GridFs'
    }
}));

module.exports = PhotoChunks;
