const express = require('express');
const router = express.Router();
const Subjects = require('../models/subject/Subject');
const Posts = require('../models/posts/Posts');
const Quizzes = require('../models/quiz/Quiz');
const IndexCards = require('../models/index-cards/IndexCards');
const Topics = require('../models/topics/Topics');

router.get('/', async (req, res) => {
    try {
        const subjects = await Subjects.find();
        res.json(subjects);
    } catch (error) {
        res.json({ message: error });
    }
});

// Get subject
router.get('/:subject', async (req, res) => {
    try {
        const subject = await Subjects.findOne({ subject: req.params.subject });
        res.json(subject);
    } catch (error) {
        res.json({ message: error });
    }
});

// Get populated subject
router.get('/:subject/populated', async (req, res) => {
    try {
        const subject = await Subjects.findOne({ subject: req.params.subject }).populate('tests', {elements: 0, subject: 0});
        const sub = subject.toObject();
        await Topics.find({ subject: req.params.subject }, {subject: 0})
            .populate('links', {elements: 0, lastUpdate: 0, schoolWeek: 0, subject: 0})
            .exec((err, posts) => {
                sub.topics = posts;
                res.json(sub);
            });
    } catch (error) {
        res.json({ message: error });
    }
});

// Get specific subjectPost by post _id
router.get('/post/:postId', async (req, res) => {
    let post = await Posts.findOne({ "_id": req.params.postId });
    if (post === null) post = await Quizzes.findOne({ "_id": req.params.postId });
    if (post === null) post = await IndexCards.findOne({ "_id": req.params.postId });
    const subject = await Subjects.findOne({ subject: post.subject });
    const topic = subject.topics.find(topic => topic.links.find(link => link.postId === req.params.postId));
    let subPost = topic?.links.find(el => el.postId === req.params.postId);
    if (!subPost) subPost = subject.tests.find(test => test.postId === req.params.postId);
    subPost.subject = subject.subject;
    subPost.lessonDate = post.lessonDate;
    res.json(subPost);
});

// Delete specific subject
router.delete('/:subject', async (req, res) => {
    try {
        const removedSubject = await Subjects.find({ subject: req.params.subject });
        res.json(removedSubject);
    } catch (error) {
        res.json({ message: error });
    }
});

// Update a subject
router.patch('/:subject/edit', async (req, res) => {
    try {
        const updatedSubject = await Subjects.updateOne(
            { subject: req.params.subject },              // get the subject
            { $set: {                                   // set the changed subject
                subject: req.body.subject,
                tests: req.body.tests,
                topics: req.body.topics,
            }}
        );
        res.json(updatedSubject);
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;
