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
        // keep increasing the page_number in the successive call by client
        let { page_number } = req.query;
        const data = await PhotoChunks.find().skip(page_number * 15).limit(15)
        res.json(data);
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
