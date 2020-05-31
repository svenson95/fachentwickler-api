const express = require('express');
const router = express.Router();
const LF1_Post = require('../models/LF1_Post');
const LF2_Post = require('../models/LF2_Post');
const LF3_Post = require('../models/LF3_Post');
const LF4_1_Post = require('../models/LF4-1_Post');
const LF4_2_Post = require('../models/LF4-2_Post');
const LF5_Post = require('../models/LF5_Post');
const LF6_Post = require('../models/LF6_Post');
const WiSo_Post = require('../models/WiSo_Post');
const Englisch_Post = require('../models/Englisch_Post');
const Deutsch_Post = require('../models/Deutsch_Post');

let subjectModel;

function setSubject(subject) {
    if (subject === "lf-1") {
        subjectModel = LF1_Post
    } else if (subject === "lf-2") {
        subjectModel = LF2_Post
    } else if (subject === "lf-3") {
        subjectModel = LF3_Post
    } else if (subject === "lf-4-1") {
        subjectModel = LF4_1_Post
    } else if (subject === "lf-4-2") {
        subjectModel = LF4_2_Post
    } else if (subject === "lf-5") {
        subjectModel = LF5_Post
    } else if (subject === "lf-6") {
        subjectModel = LF6_Post
    } else if (subject === "wiso") {
        subjectModel = WiSo_Post
    } else if (subject === "englisch") {
        subjectModel = Englisch_Post
    } else if (subject === "deutsch") {
        subjectModel = Deutsch_Post
    }
}

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
        setSubject(req.params.subject);
        const urlString = "/" + req.params.subject + "/" + req.params.topic + "/" + req.params.postTitle;
        const post = await subjectModel.find({ "url": urlString });
        res.json(post);
    } catch (error) {
        res.json({ message: error });
    }
});

// Submit new post
router.post('/:subject/new', async (req, res) => {

    setSubject(req.params.subject);
    const post = new subjectModel({
       url: req.body.url,
       topic: req.body.topic,
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
router.patch('/:subject/:postId/edit', async (req, res) => {
    setSubject(req.params.subject);
    try {
        const updatedPost = await subjectModel.updateOne(
            { _id: req.params.postId },             // get the post
            { $set: {                               // set the changed post
                topic: req.body.topic,
                url: req.body.url,
                elements: req.body.elements,
            }}
        );
        res.json(updatedPost);
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;
