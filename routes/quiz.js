const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz/Quiz');

// Get specific quiz
router.get('/:topic/:quiz', async (req, res) => {
    try {
        const urlString = req.params.topic + "/" + req.params.quiz;
        const quiz = await Quiz.findOne({ "url": urlString });
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({
            message: 'Get quiz failed. Try again',
            error: error
        })
    }
});

// Submit new quiz
router.post('/new', async (req, res) => {

    const quiz = new Quiz(req.body);

    try {
        await quiz.save(err => {
            if (err) {
                res.status(500).json({
                    message: 'Post new quiz failed. Try again',
                    error: err
                })
            } else {
                res.status(200).json({
                    message: 'Quiz successfully created',
                    quiz: quiz
                })
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
        res.status(200).json(removedQuiz);
    } catch (error) {
        res.status(500).json({
            message: 'Delete quiz failed. Try again',
            error: error
        });
    }
});

// Update a quiz
router.patch('/:quizId/edit', async (req, res) => {
    try {
        const updatedQuiz = await Quiz.updateOne(
            { "_id": req.params.quizId },
            { $set: req.body }
        );
        res.status(200).json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

module.exports = router;
