const express = require('express');
const router = express.Router();
const IndexCards = require('../models/index-cards/IndexCards');
const Subjects = require('../models/subject/Subject');

// Get specific index-cards
router.get('/:subject/:topic/:title/index-cards', async (req, res) => {
    try {
        const indexCardsUrl = req.params.topic + "/" + req.params.title + "/index-cards";
        const subject = await Subjects.findOne({ subject: req.params.subject });
        const topic = subject.topics?.find(topic => topic.links?.find(link => link.url === indexCardsUrl));
        const indexCardsDetails = topic?.links.find(el => el.url === indexCardsUrl);
        const urlString = req.params.topic + "/" + req.params.title + "/index-cards";
        const indexCards = await IndexCards.findOne({ "url": urlString });
        return res.json({ content: indexCards, details: indexCardsDetails });
    } catch (error) {
        res.json({ message: 'Failed get index-cards', error: error })
    }
});

// Submit new index-cards
router.post('/new', async (req, res) => {

    const indexCards = new IndexCards({
        url: req.body.url,
        questions: req.body.questions,
        subject: req.body.subject
    });

    try {
        await indexCards.save(err => {
            if (err) {
                res.status(500).json({ message: 'Error has occured while post new index-cards', error: err })
            } else {
                res.status(200).json({ message: 'Successfully posted index-cards', content: indexCards })
            }
        });
    } catch (error) {
        return res.json({ message: 'Save new index-cards failed', error: error });
    }
});

// Delete specific index-cards
router.delete('/:url', async (req, res) => {
    try {
        const removedIndexCards = await IndexCards.remove({ url: req.params.url });
        return res.json(removedIndexCards);
    } catch (error) {
        return res.json({ message: error });
    }
});

// Update index-cards
router.patch('/:subject/:topic/:title/edit', async (req, res) => {
    const urlString = "/" + req.params.topic + "/" + req.params.title + '/index-cards';
    try {
        const updatedIndexCards = await IndexCards.updateOne(
            { "url": urlString },                   // get the post
            { $set: {                               // set the changed post
                url: req.body.url,
                lessonDate: req.body.lessonDate,
                lastUpdate: req.body.lastUpdate,
                questions: req.body.questions,
                subject: req.body.subject
            }}
        );
        return res.json(updatedIndexCards);
    } catch (error) {
        return res.json({ message: 'Update index-cards failed', error: error });
    }
});

module.exports = router;
