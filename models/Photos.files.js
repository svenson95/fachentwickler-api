const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_CONNECTION_POSTIMAGES, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const PhotoFiles = connection.model('photos.files', new mongoose.Schema({
    uploadDate: { type: Date, required: true },
    filename: { type: String, required: true },
    md5: { type: String, required: true },
    contentType: { type: String, required: true },
    image_file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GridFs'
    },
}));

module.exports = PhotoFiles;
