const express = require('express');
const router = express.Router();
const IndexCards = require('../models/index-cards/IndexCards');

// Get specific index-cards
router.get('/:topic/:title/karteikarten', async (req, res) => {
    try {
        const urlString = req.params.topic + "/" + req.params.title + "/karteikarten";
        const indexCards = await IndexCards.findOne({ "url": urlString });
        return res.status(200).json(indexCards);
    } catch (error) {
        res.status(500).json({
            message: 'Get index-cards failed. Try again',
            error: error
        })
    }
});

// Submit new index-cards
router.post('/create', async (req, res) => {

    const indexCards = new IndexCards(req.body);
    await indexCards.save(err => {
        if (err) {
            res.status(500).json({
                message: 'Post new index-cards failed. Try again',
                error: err
            })
        } else {
            res.status(200).json({
                message: 'New index-cards successfully created',
                content: indexCards
            })
        }
    });
});

// Delete specific index-cards
router.delete('/:cardsId/delete', async (req, res) => {
    try {
        const removedIndexCards = await IndexCards.remove({ "_id": req.params.cardsId });
        return res.status(200).json({
            message: 'Index-cards successfully removed',
            content: removedIndexCards
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Delete index-cards failed. Try again',
            error: error
        });
    }
});

// Update index-cards
router.patch('/:cardsId/edit', async (req, res) => {
    try {
        const updatedIndexCards = await IndexCards.updateOne(
            { "_id": req.params.cardsId },
            { $set: req.body }
        );
        return res.json({
            message: 'Index-cards successfully updated',
            content: updatedIndexCards
        });
    } catch (error) {
        return res.json({
            message: 'Update index-cards failed. Try again',
            error: error
        });
    }
});

module.exports = router;
