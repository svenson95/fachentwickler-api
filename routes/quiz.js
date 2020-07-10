const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz/Quiz');

// Get specific quiz
router.get('/:subject/:topic/:quizTitle/quiz', async (req, res) => {
    try {
        const urlString = "/" + req.params.subject + "/" + req.params.topic + "/" + req.params.quizTitle + "/quiz";
        const post = await Quiz.find({ "url": urlString });
        return res.json(post);
    } catch (error) {
        return res.json({ message: error });
    }
});

// Submit new quiz
router.post('/new', async (req, res) => {

    const quiz = new Quiz({
        url: req.body.url,
        questions: req.body.questions
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
                questions: req.body.questions
            }}
        );
        return res.json(updatedQuiz);
    } catch (error) {
        return res.json({ message: error });
    }
});

module.exports = router;
