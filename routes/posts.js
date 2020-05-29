const express = require('express');
const router = express.Router();
const LF1_Post = require('../models/LF1_Post');
const mongoose = require('mongoose');

// Database Connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("Connection successful! 2");
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

// Get specific post
router.get('/:subject/:topic/:postTitle*', async (req, res) => {
    try {
        const urlString = "/" + req.params.subject + "/" + req.params.topic + "/" + req.params.postTitle;
        const post = await LF1_Post.find({ "url": urlString });
        res.json(post);
    } catch (error) {
        res.json({ message: error });
    }
});

// Submit new post
router.post('/:subject/:topic/:postTitle*', async (req, res) => {

    const urlString = "/" + req.params.subject + "/" + req.params.topic + "/" + req.params.postTitle;
    const post = new LF1_Post({
       url: urlString,
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
        const removedPost = await LF1_Post.remove({ _id: req.params.postId });
        res.json(removedPost);
    } catch (error) {
        res.json({ message: error });
    }
});

// Update a post
router.patch('/:postId', async (req, res) => {
    try {
        const updatedPost = await LF1_Post.updateOne(
            { _id: req.params.postId },             // get the post
            { $set: { title: req.body.title } }     // set the changed post
        );
        res.json(updatedPost);
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;
