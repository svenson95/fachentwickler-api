const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
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

// Get all the subjects
router.get('/lf-1', async (req, res) => {
    try {
        const lf1_collection = mongoose.model("lf-1", SubjectSchema);
        const subjects = await Subject.find();
        res.json(subjects);
    } catch (error) {
        res.json({ message: error });
    }
});

router.get('/lf-2', async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.json(subjects);
    } catch (error) {
        res.json({ message: error });
    }
});

// Get specific subject
router.get('/:subjectId', async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.subjectId);
        res.json(subject);
    } catch (error) {
        res.json({ message: error });
    }
});

// Submit new subject
router.post('/', async (req, res) => {
    const subject = new Subject({
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        elements: req.body.elements
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
        const removedSubject = await Subject.remove({ _id: req.params.subjectId });
        res.json(removedSubject);
    } catch (error) {
        res.json({ message: error });
    }
});

// Update a subject
router.patch('/:subjectId', async (req, res) => {
    try {
        const updatedSubject = await Subject.updateOne(
            { _id: req.params.subjectId },             // get the subject
            { $set: { title: req.body.title } }     // set the changed subject
        );
        res.json(updatedSubject);
    } catch (error) {
        res.json({ message: error });
    }
});


module.exports = router;
