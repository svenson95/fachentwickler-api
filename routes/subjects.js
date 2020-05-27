const express = require('express');
const router = express.Router();
const LF1Subject = require('../models/LF1_Subject');
const LF2Subject = require('../models/LF2_Subject');
const mongoose = require('mongoose');

// Database Connection
mongoose.connect(process.env.DB_CONNECTION_SUBJECTS, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("Connection successful!");
});

router.get('/lf-1', async (req, res) => {
    try {
        const subjects = await LF1Subject.find();
        res.json(subjects);
    } catch (error) {
        res.json({ message: error });
    }
});

router.get('/lf-2', async (req, res) => {
    try {
        const subjects = await LF2Subject.find();
        res.json(subjects);
    } catch (error) {
        res.json({ message: error });
    }
});

// Get specific subject
router.get('/:subjectId', async (req, res) => {
    try {
        const subject = await LF2Subject.findById(req.params.subjectId);
        res.json(subject);
    } catch (error) {
        res.json({ message: error });
    }
});

// Submit new subject
router.post('/', async (req, res) => {
    const subject = new LF2Subject({
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
        const removedSubject = await LF2Subject.remove({ _id: req.params.subjectId });
        res.json(removedSubject);
    } catch (error) {
        res.json({ message: error });
    }
});

// Update a subject
router.patch('/:subjectId', async (req, res) => {
    try {
        const updatedSubject = await LF2Subject.updateOne(
            { _id: req.params.subjectId },             // get the subject
            { $set: { subject: req.body.subject } }     // set the changed subject
        );
        res.json(updatedSubject);
    } catch (error) {
        res.json({ message: error });
    }
});


module.exports = router;
