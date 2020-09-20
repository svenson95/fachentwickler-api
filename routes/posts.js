const express = require('express');
const router = express.Router();
const Posts = require('../models/posts/Posts');
const Subjects = require('../models/subject/Subject');

function currentDate() {
    const today = new Date();
    let yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;     // 0-11
    let dd = today.getDate();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    return yyyy + "-" + mm + "-" + dd;
}

// Get all the posts
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find();
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
        const testUrl = req.params.topic + "/test";
        const post = await Posts.findOne({ "url": testUrl });
        res.json({
            title: testDetails?.title,
            description: testDetails?.description,
            topic: post.topic,
            subject: post.subject,
            lessonDate: post.lessonDate,
            lastUpdate: post.lastUpdate,
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
        const urlString = req.params.topic + "/" + req.params.post;
        const post = await Posts.findOne({ "url": urlString });
        res.json({
            title: postDetails.title,
            description: postDetails.description,
            topic: post.topic,
            subject: post.subject,
            lessonDate: post.lessonDate,
            lastUpdate: post.lastUpdate,
            url: post.url,
            elements: post.elements,
            _id: post._id
        });
    } catch (error) {
        res.json({ message: error });
    }
});

// Get latest 10 post urls
router.get('/last-lessons', async (req, res) => {
    try {
        const posts = await Posts.find();
        posts.sort(function(a, b) {
            if (a.lessonDate < b.lessonDate) { return -1; }
            if (a.lessonDate > b.lessonDate) { return 1; }
            return 0;
        });
        const lastLessons = posts.slice(Math.max(posts.length - 10, 0));
        res.status(200).json(lastLessons.map(el => el._id));
    } catch(error) {
        res.status(500).json({ message: 'Error has occured while get last lessons', error: error });
    }
});

// Submit new post
router.post('/:subject/:topic/new', async (req, res) => {

    const post = new Posts({
        url: req.body.url,
        topic: req.body.topic,
        subject: req.body.subject,
        lessonDate: req.body.lessonDate,
        lastUpdate: currentDate(),
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
            post: post
        });
    } catch (error) {
        res.json({ message: error });
    }
});

// Delete specific post
router.delete('/:subject/:topic/:post*', async (req, res) => {
    const urlString = req.params.topic + "/" + req.params.post;
    try {
        const removedPost = await Posts.remove({ "url": urlString });
        res.json({ message: "Post successfully removed", post: removedPost });
    } catch (error) {
        res.json({ message: "Delete post failed", error: error });
    }
});

// Update a post
router.patch('/:subject/:topic/:post/edit', async (req, res) => {
    const urlString = req.params.topic + "/" + req.params.post;
    try {
        const updatedPost = await Posts.updateOne(
            { "url": urlString },                   // get the post
            { $set: {                               // set the changed post
                url: req.body.url,
                topic: req.body.topic,
                subject: req.body.subject,
                lessonDate: req.body.lessonDate,
                lastUpdate: currentDate(),
                elements: req.body.elements,
            }}
        );
        res.json(updatedPost);
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;
