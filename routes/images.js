const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");
const mongoose = require('mongoose');
const mongo = require('mongodb');
const PhotoChunks = require('../models/photos/Photos.chunks');

var Grid = require('gridfs-stream');
var gfs;

let db = mongoose.connection;
db = mongoose.createConnection(process.env.DB_CONNECTION_POSTIMAGES, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
db.once("open", () => {
    console.log("Connection successful!");
    gfs = Grid(db, mongo);
});

router.get("/", homeController.getHome);

// Get all images
router.get('/all', async (req, res) => {
    try {
        let { page, size } = req.query;
        const files = await PhotoFiles.find()
            .sort({$natural:-1})
            .skip(page * Number(size))
            .limit(Number(size));
        const chunks = await PhotoChunks.find({ files_id : { $in : files.map(el => el._id) } });
        const images = [];
        files.forEach(file => {
            const _chunks = chunks.filter(el => String(el.files_id) === String(file._id));
            images.push({ file: file, chunks: _chunks });
        })
        res.json(images);
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

// Get specific post - by id
router.get('/:id', async (req, res) => {
    try {
        await PhotoChunks.find({ files_id: req.params.id }, (err, files) => {
            if (err) {
                res.json(err);
            } else {
                res.json(files);
            }
        });
    } catch (error) {
        res.json({ message: error });
    }
});

// Upload image
router.post("/upload", uploadController.uploadFile);

module.exports = router;
