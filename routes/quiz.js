const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz/Quiz');
const Subjects = require('../models/subject/Subject');

// Get specific quiz
router.get('/:subject/:topic/:quiz/quiz', async (req, res) => {
    try {
        const quizUrl = req.params.topic + "/" + req.params.quiz + "/quiz";
        const subject = await Subjects.findOne({ subject: req.params.subject });
        const topic = subject.topics?.find(topic => topic.links?.find(link => link.url === quizUrl));
        const quizDetails = topic?.links.find(el => el.url === quizUrl);
        const urlString = req.params.topic + "/" + req.params.quiz + "/quiz";
        const quiz = await Quiz.findOne({ "url": urlString });
        return res.json({ content: quiz, details: quizDetails });
    } catch (error) {
        res.json({ message: 'Failed get quiz', error: error })
    }
});

// Submit new quiz
router.post('/new', async (req, res) => {

    const quiz = new Quiz({
        url: req.body.url,
        questions: req.body.questions,
        subject: req.body.subject
    });

    try {
        await quiz.save(err => {
            if (err) {
                res.status(500).json({ message: { msgBody: 'Error has occured while post new quiz', msgError: true }})
            } else {
                res.status(200).json({ message: { msgBody: 'Successfully posted quiz', msgError : false }})
            }
        });
    } catch (error) {
        return res.json({ message: error });
    }
});

// Delete specific quiz
router.delete('/:url', async (req, res) => {
    try {
        const removedQuiz = await Quiz.remove({ url: req.params.url });
        return res.json(removedQuiz);
    } catch (error) {
        return res.json({ message: error });
    }
});

// Update a quiz
router.patch('/:subject/:quiz/edit', async (req, res) => {
    const urlString = "/" + req.params.subject + "/" + req.params.quiz;
    try {
        const updatedQuiz = await Quiz.updateOne(
            { "url": urlString },                   // get the post
            { $set: {                               // set the changed post
                url: req.body.url,
                lessonDate: req.body.lessonDate,
                lastUpdate: req.body.lastUpdate,
                questions: req.body.questions,
                subject: req.body.subject
            }}
        );
        return res.json(updatedQuiz);
    } catch (error) {
        return res.json({ message: error });
    }
});

module.exports = router;
