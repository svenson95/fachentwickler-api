const express = require('express');
const router = express.Router();
const LF1_Post = require('../models/posts/LF1_Post');
const LF2_Post = require('../models/posts/LF2_Post');
const LF3_Post = require('../models/posts/LF3_Post');
const LF4_1_Post = require('../models/posts/LF4-1_Post');
const LF4_2_Post = require('../models/posts/LF4-2_Post');
const LF5_Post = require('../models/posts/LF5_Post');
const LF6_Post = require('../models/posts/LF6_Post');
const WiSo_Post = require('../models/posts/WiSo_Post');
const Englisch_Post = require('../models/posts/Englisch_Post');
const Deutsch_Post = require('../models/posts/Deutsch_Post');
const Subjects = require('../models/subject/Subject');

let postModel;

function setPostModel(subject) {
    if (subject === "lf-1") {
        postModel = LF1_Post
    } else if (subject === "lf-2") {
        postModel = LF2_Post
    } else if (subject === "lf-3") {
        postModel = LF3_Post
    } else if (subject === "lf-4-1") {
        postModel = LF4_1_Post
    } else if (subject === "lf-4-2") {
        postModel = LF4_2_Post
    } else if (subject === "lf-5") {
        postModel = LF5_Post
    } else if (subject === "lf-6") {
        postModel = LF6_Post
    } else if (subject === "wiso") {
        postModel = WiSo_Post
    } else if (subject === "englisch") {
        postModel = Englisch_Post
    } else if (subject === "deutsch") {
        postModel = Deutsch_Post
    }
}

// Get all the posts
router.get('/', async (req, res) => {
    try {
        const posts = await postModel.find();
        res.json(posts);
    } catch (error) {
        res.json({ message: error });
    }
});

// Get specific test
router.get('/:subject/:topic/test', async (req, res) => {
    const subjectWithPost = await Subjects.findOne({ subject: req.params.subject });
    const testDetails = await subjectWithPost.tests.find(el => el.url === req.params.topic + "/" + req.params.post || el.url === req.params.topic + "/test");
    if (testDetails === undefined) {
        subjectWithPost.tests.find(el => el.url === req.params.topic + "/test")
    }
    try {
        setPostModel(req.params.subject);
        const urlString = req.params.topic + "/test";
        const post = await postModel.findOne({ "url": urlString });
        res.json({
            title: testDetails?.title,
            description: testDetails?.description,
            topic: post.topic,
            url: post.url,
            elements: post.elements,
            _id: post._id
        });
    } catch (error) {
        res.json({ message: error });
    }
});

// Get specific post
router.get('/:subject/:topic/:post', async (req, res) => {
    const subjectWithPost = await Subjects.findOne({ subject: req.params.subject });
    const subjectTopics = subjectWithPost.topics.flatMap(el => el.links);
    const postDetails = await subjectTopics.find(el => el.url === req.params.topic + "/" + req.params.post || el.url === req.params.topic + "/test");
    if (postDetails === undefined) {
        subjectWithPost.tests.find(el => el.url === req.params.topic + "/test")
    }
    try {
        setPostModel(req.params.subject);
        const urlString = req.params.topic + "/" + req.params.post;
        const post = await postModel.findOne({ "url": urlString });
        res.json({
            title: postDetails.title,
            description: postDetails.description,
            topic: post.topic,
            url: post.url,
            elements: post.elements,
            _id: post._id
        });
    } catch (error) {
        res.json({ message: error });
    }
});

// Submit new post
router.post('/:subject/:topic/new', async (req, res) => {

    setPostModel(req.params.subject);
    const post = new postModel({
        url: req.body.url,
        topic: req.body.topic,
        elements: req.body.elements
    });

    const subjectWithPost = await Subjects.findOne({ subject: req.params.subject });
    const subjectLinks = subjectWithPost.topics.flatMap(el => el.links) || subjectWithPost.tests;
    const postDetails = await subjectLinks.find(el => el.url === req.body.url);

    try {
        await post.save();
        res.json({
            title: postDetails.title,
            description: postDetails.description,
            topic: req.body.topic,
            url: req.body.url,
            elements: req.body.elements
        });
    } catch (error) {
        res.json({ message: error });
    }
});

// Delete specific post
router.delete('/:subject/:topic/:post*', async (req, res) => {
    setPostModel(req.params.subject);
    const urlString = "/" + req.params.subject + "/" + req.params.topic + "/" + req.params.post;
    try {
        const removedPost = await LF1_Post.remove({ "url": urlString });
        res.json(removedPost);
    } catch (error) {
        res.json({ message: error });
    }
});

// Update a post
router.patch('/:subject/:topic/:post/edit', async (req, res) => {
    setPostModel(req.params.subject);
    const urlString = req.params.topic + "/" + req.params.post;
    try {
        const updatedPost = await postModel.updateOne(
            { "url": urlString },                   // get the post
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
