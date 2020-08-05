const express = require('express');
const router = express.Router();
const Subjects = require('../models/subject/Subject');

router.get('/', async (req, res) => {
    try {
        const subjects = await Subjects.find();
        res.json(subjects);
    } catch (error) {
        res.json({ message: error });
    }
});

// Get specific subject
router.get('/:subjectId', async (req, res) => {
    try {
        const subject = await Subjects.findById(req.params.subjectId);
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
                            topic: link.topic,
                        }
                    })
                }
            }),
            tests: subject.tests.map(test => {
                return {
                    description: test.description,
                    title: test.title,
                    url: test.url,
                }
            })
        });
    } catch (error) {
        res.json({ message: error });
    }
});

router.get('/:subject/:topic/:article', async (req, res) => {
    try {
        const subject = await Subjects.find({ "subject": req.params.subject });
        const articleUrl = req.params.topic + "/" + req.params.article;
        let article;
        const topic = subject[0].topics?.find(el => el?.links.find(el => el.url === articleUrl));
        const topicArticle = topic?.links.find(el => el.url === articleUrl);
        const testArticle = subject[0].tests?.find(el => el.url === articleUrl);
        article = topicArticle || testArticle;
        res.json(article);
    } catch (error) {
        res.json({ error: true, message: "No subject found" + error });
    }
});

// Delete specific subject
router.delete('/:subjectId', async (req, res) => {
    try {
        const removedSubject = await Subjects.findById({ _id: req.params.subjectId });
        res.json(removedSubject);
    } catch (error) {
        res.json({ message: error });
    }
});

// Update a subject
router.patch('/:subjectId/edit', async (req, res) => {
    try {
        const updatedSubject = await Subjects.updateOne(
            { _id: req.params.subjectId },              // get the subject
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
