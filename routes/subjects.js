const express = require('express');
const router = express.Router();
const Subjects = require('../models/subject/Subject');
const Posts = require('../models/posts/Posts');
const Quizzes = require('../models/quiz/Quiz');

router.get('/', async (req, res) => {
    try {
        const subjects = await Subjects.find();
        res.json(subjects);
    } catch (error) {
        res.json({ message: error });
    }
});

// Get specific subject
router.get('/:subject', async (req, res) => {
    try {
        const subject = await Subjects.findOne({ subject: req.params.subject });
        res.json({
            subject: subject.subject,
            topics: subject.topics.map(el => {
                return {
                    title: el.title,
                    links: el.links.map(link => {
                        return {
                            title: link.title,
                            description: link.description,
                            url: link.url,
                            postId: link.postId
                        }
                    })
                }
            }),
            tests: subject.tests.map(test => {
                return {
                    description: test.description,
                    title: test.title,
                    url: test.url,
                    postId: test.postId
                }
            })
        });
    } catch (error) {
        res.json({ message: error });
    }
});

// Get specific subjectPost by post _id
router.get('/post/:postId', async (req, res) => {
    let post = await Posts.findOne({ "_id": req.params.postId });
    if (post === null) post = await Quizzes.findOne({ "_id": req.params.postId });
    const subject = await Subjects.findOne({ subject: post.subject });
    const topic = subject.topics.find(topic => topic.links.find(link => link.postId === req.params.postId));
    let subPost = topic?.links.find(el => el.postId === req.params.postId);
    if (!subPost) subPost = subject.tests.find(test => test.postId === req.params.postId);
    subPost.subject = subject.subject;
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
