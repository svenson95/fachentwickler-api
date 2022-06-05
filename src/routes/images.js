const express = require('express');
const router = express.Router();
const homeController = require('../controllers/images-home');
const uploadController = require('../controllers/upload');
const PhotoChunks = require('../models/photos/Photos.chunks');
const PhotoFiles = require('../models/photos/Photos.files');

router.get('/', homeController.getHome);

// Get all images with pagination params
router.get('/all', async (req, res) => {
  try {
    let { page, size, sort } = req.query;

    const files = await PhotoFiles.find()
      .sort({ $natural: sort === 'ascending' ? 1 : -1 })
      .skip(page * Number(size))
      .limit(Number(size));

    res.json(files);
  } catch (error) {
    res.json({ message: error });
  }
});

// Get images count
router.get('/count', async (req, res) => {
  try {
    const files = await PhotoFiles.find();
    res.json(files.length);
  } catch (error) {
    res.json({ message: error });
  }
});

// Get specific image by id
router.get('/:id', async (req, res) => {
  try {
    await PhotoFiles.findOne({ _id: req.params.id }, async (err, file) => {
      if (err) {
        res.status(500).json({
          message: 'Error occured while find file.',
          error: err,
        });
      } else if (!file) {
        res.status(400).json({
          message: 'File not found.',
          id: req.params.id,
        });
      }
      await PhotoChunks.find({ files_id: req.params.id }, (err, chunks) => {
        if (err) {
          res.status(500).json({
            message: 'Error occured while find chunks.',
            error: err,
          });
        } else {
          res.status(200).json({
            file: file,
            chunks: chunks,
          });
        }
      });
    });
  } catch (error) {
    res.json({ message: error });
  }
});

// Upload image
router.post('/upload', uploadController.uploadFile);

// Delete specific image by id
router.delete('/:id/delete', async (req, res) => {
  try {
    const removedImageChunks = await PhotoChunks.remove({
      files_id: req.params.id,
    });
    const removedImageFiles = await PhotoFiles.remove({ _id: req.params.id });
    res.json({
      message: 'Successfully removed image',
      chunks: removedImageChunks,
      files: removedImageFiles,
    });
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
