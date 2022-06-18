const util = require('util');
const multer = require('multer');
const mongoose = require('./mongoose');

var storage = new GridFsStorage({
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
    } else if (files.indexOf(file.mimetype) !== -1) {
      return {
        bucketName: 'file-elements',
        filename: file.originalname,
      };
    } else {
      if (files.indexOf(file.mimetype) === -1) {
        return {
          bucketName: file.mimetype,
          filename: file.originalname,
        };
      }
    }
  },
});

var uploadFile = multer({ storage: storage }).single('file');
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;
