const express = require('express');
const router = express.Router();
const LF1_Post = require('../models/LF1_Post');
const LF2_Post = require('../models/LF2_Post');
const mongoose = require('mongoose');

// Database Connection
mongoose.connect(process.env.DB_CONNECTION_POSTS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("Connection successful!");
});

// Get all the posts
router.get('/lf-1', async (req, res) => {
    try {
        const posts = await LF1_Post.find();
        res.json(posts);
    } catch (error) {
        res.json({ message: error });
    }
});

router.get('/lf-2', async (req, res) => {
    try {
        const posts = await LF2_Post.find();
        res.json(posts);
    } catch (error) {
        res.json({ message: error });
    }
});

// Get specific post
router.get('/:postId', async (req, res) => {
    try {
        const post = await LF2_Post.findById(req.params.postId);
        res.json(post);
    } catch (error) {
        res.json({ message: error });
    }
});

// Submit new post
router.post('/', async (req, res) => {
    const post = new LF2_Post({
       url: req.body.url,
       topic: req.body.description,
       elements: req.body.elements
    });

    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (error) {
        res.json({ message: error });
    }
});

// Delete specific post
router.delete('/:postId', async (req, res) => {
    try {
        const removedPost = await LF2_Post.remove({ _id: req.params.postId });
        res.json(removedPost);
    } catch (error) {
        res.json({ message: error });
    }
});

// Update a post
router.patch('/:postId', async (req, res) => {
    try {
        const updatedPost = await LF2_Post.updateOne(
            { _id: req.params.postId },             // get the post
            { $set: { title: req.body.title } }     // set the changed post
        );
        res.json(updatedPost);
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;
