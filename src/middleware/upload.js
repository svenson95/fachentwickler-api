const util = require('util');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('./mongoose');

const storage = new GridFsStorage({
  db: mongoose.postimages,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const images = ['image/png', 'image/jpeg', 'image/gif'];
    const files = [
      'application/pdf',
      'image/jpeg',
      'application/vnd.oasis.opendocument.text',
      'application/gzip',
      'application/zip',
    ];

    if (images.indexOf(file.mimetype) !== -1) {
      return {
        bucketName: 'photos',
        filename: file.originalname,
      };
    }
    if (files.indexOf(file.mimetype) !== -1) {
      return {
        bucketName: 'file-elements',
        filename: file.originalname,
      };
    }
    return {
      bucketName: file.mimetype,
      filename: file.originalname,
    };
  },
});

const uploadFile = multer({ storage }).single('file');
const uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;
