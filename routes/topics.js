const express = require('express');
const router = express.Router();
const Topics = require('../models/topics/Topics');

// Get all topics
router.get('/', async (req, res) => {
    try {
        const topics = await Topics.find();
        res.json(topics);
    } catch (error) {
        res.json({
            message: 'GET all topics failed. Try it again',
            error: error
        });
    }
});

// Get all topics for specific subject
router.get('/:subject', async (req, res) => {
    try {
        const topics = await Topics.find({ subject: req.params.subject });
        res.json(topics);
    } catch (error) {
        res.json({
            message: 'GET all topics for subject failed. Try it again',
            error: error
        });
    }
});

// Get populated topics for specific subject
router.get('/:subject/populated', async (req, res) => {
    try {
        // User.findById({ _id : req.user._id }).populate('progress').exec((err, user) => {
        await Topics.find({ subject: req.params.subject })
            .populate('links', { elements: 0})
            .populate('tests', { elements: 0})
            .exec((err, topics) => {
            res.json(topics);
        });
    } catch (error) {
        res.json({
            message: 'GET all topics for subject failed. Try it again',
            error: error
        });
    }
});

// Post new topic
router.post('/new', async (req, res) => {

    try {
        const topic = new Topics({
            title: req.body.title,
            subject: req.body.subject,
            links: req.body.links
        });

        await topic.save();
        res.json({
            message: 'Topic successfully created',
            topic: topic
        });
    } catch (error) {
        res.json({
            message: 'POST new topic failed. Try it again',
            error: error
        });
    }
});

// Delete specific topic
router.delete('/:topicId', async (req, res) => {
    try {
        const topicToDelete = await Topics.find({ _id: req.params.topicId });
        res.json(topicToDelete);
    } catch (error) {
        res.json({
            message: 'DELETE topic failed. Try it again',
            error: error
        });
    }
});

// Update a topic
router.patch('/edit', async (req, res) => {
    try {
        const topicToUpdate = await Topics.updateOne(
            { subject: req.body.subject, title: req.body.title },
            { $set: req.body }
            // { $set: {
            //         subject: req.body.subject,
            //         tests: req.body.tests,
            //         topics: req.body.topics,
            //     }
            // }
        );
        res.json({
            message: 'Topic successfully updated',
            result: topicToUpdate
        });
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;
