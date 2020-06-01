const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");
const mongoose = require('mongoose');
const mongo = require('mongodb');
const PhotoChunks = require('../models/Photos.chunks');

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

// Get specific post - by id
router.get('/:id', async (req, res) => {
    try {
        const post = await PhotoChunks.findById(req.params.id);
        // const post = await PhotoChunks.find({ "id": req.params.id });
        res.json(post);
    } catch (error) {
        res.json({ message: error });
    }
});

// Upload image
router.post("/upload", uploadController.uploadFile);

module.exports = router;
