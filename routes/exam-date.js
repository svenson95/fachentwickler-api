const express = require('express');
const router = express.Router();
const ExamDate = require('../models/exam-date/ExamDate');

// Get all exam dates
router.get('/', async (req, res) => {
    try {
        const posts = await ExamDate.find();
        res.json(posts);
    } catch (error) {
        res.json({ message: error });
    }
});

// Submit new exam date
router.post('/add', async (req, res) => {

    const examDate = new ExamDate(req.body);

    try {
        await examDate.save();
        res.json(examDate);
    } catch (error) {
        res.json({ message: error });
    }
});

// Delete specific exam date
router.delete('/:subject/:topic/:post*', async (req, res) => {
    // const urlString = req.params.topic + "/" + req.params.post;
    // try {
    //     const removedPost = await Posts.remove({ "url": urlString });
    //     res.json({ message: "Post successfully removed", post: removedPost });
    // } catch (error) {
    //     res.json({ message: "Delete post failed", error: error });
    // }
});

// Update a exam date
router.patch('/:subject/:topic/:post/edit', async (req, res) => {
    // const urlString = req.params.topic + "/" + req.params.post;
    // try {
    //     const updatedPost = await Posts.updateOne(
    //         { "url": urlString },                   // get the post
    //         { $set: {                               // set the changed post
    //             url: req.body.url,
    //             topic: req.body.topic,
    //             subject: req.body.subject,
    //             lessonDate: req.body.lessonDate,
    //             lastUpdate: currentDate(),
    //             elements: req.body.elements,
    //         }}
    //     );
    //     res.json(updatedPost);
    // } catch (error) {
    //     res.json({ message: error });
    // }
});

module.exports = router;
