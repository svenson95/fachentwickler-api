const express = require('express');
const router = express.Router();
const List = require('../models/List');
const mongoose = require('mongoose');

// Database Connection
router.get('/all', async (req, res) => {
    try {
        const subjects = await List.find();
        res.json(subjects);
    } catch (error) {
        res.json({ message: error });
    }
});

// Get specific subject
router.get('/:subjectId', async (req, res) => {
    try {
        const subject = await List.findById(req.params.subjectId);
        res.json(subject);
    } catch (error) {
        res.json({ message: error });
    }
});

// Submit new subject
router.post('/', async (req, res) => {
    const subject = new List({
        subject: req.body.subject,
        topics: req.body.topics,
        tests: req.body.tests
    });

    try {
        const savedSubject = await subject.save();
        res.json(savedSubject);
    } catch (error) {
        res.json({ message: error });
    }
});

// Delete specific subject
router.delete('/:subjectId', async (req, res) => {
    try {
        const removedSubject = await List.remove({ _id: req.params.subjectId });
        res.json(removedSubject);
    } catch (error) {
        res.json({ message: error });
    }
});

// Update a subject
router.patch('/:subjectId', async (req, res) => {
    try {
        const updatedSubject = await List.updateOne(
            { _id: req.params.subjectId },             // get the subject
            { $set: { subject: req.body.subject } }     // set the changed subject
        );
        res.json(updatedSubject);
    } catch (error) {
        res.json({ message: error });
    }
});


module.exports = router;
