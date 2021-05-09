const express = require('express');
const router = express.Router();
const Matching = require('../models/matching/Matching');

function currentDate() {
    const today = new Date();
    let yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;     // 0-11
    let dd = today.getDate();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    return yyyy + "-" + mm + "-" + dd;
}

// Get specific matching
router.get('/:topic/:title/matching', async (req, res) => {
    try {
        const urlString = req.params.topic + "/" + req.params.title + "/matching";
        const indexCards = await Matching.findOne({ "url": urlString });
        return res.status(200).json(indexCards);
    } catch (error) {
        res.status(500).json({
            message: 'Get index-cards failed. Try again',
            error: error
        })
    }
});

// Submit new matching
router.post('/create', async (req, res) => {

    const matching = new Matching(req.body);
    await matching.save(err => {
        if (err) {
            res.status(500).json({
                message: 'Post new matching failed. Try again',
                error: err
            })
        } else {
            res.status(200).json({
                message: 'New matching successfully created',
                content: matching
            })
        }
    });
});

// Delete specific matching
router.delete('/:matchingId/delete', async (req, res) => {
    try {
        const removedMatchings = await Matching.remove({ "_id": req.params.matchingId });
        return res.status(200).json({
            message: 'Matchings successfully removed',
            content: removedMatchings
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Delete matchings failed. Try again',
            error: error
        });
    }
});

// Update matching
router.patch('/:matchingId/edit', async (req, res) => {
    try {
        const updatedMatchings = await Matching.updateOne(
            { "_id": req.params.matchingId },
            { $set: {
                url: req.body.url,
                topicId: req.body.topicId,
                title: req.body.title,
                description: req.body.description,
                subject: req.body.subject,
                type: req.body.type,
                schoolWeek: req.body.schoolWeek,
                lessonDate: req.body.lessonDate,
                lastUpdate: currentDate(),
                pairs: req.body.pairs,
            }}
        );
        return res.json({
            message: 'Matchings successfully updated',
            content: updatedMatchings
        });
    } catch (error) {
        return res.json({
            message: 'Update matchings failed. Try again',
            error: error
        });
    }
});

module.exports = router;
