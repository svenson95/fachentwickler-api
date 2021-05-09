const express = require('express');
const router = express.Router();
const News = require('../models/news/News');

// Get news list
router.get('/', async (req, res) => {
    try {
        const news = await News.find({}, {content: 0});
        news.sort(function(a, b) {
            if (a.date > b.date) { return -1; }
            if (a.date < b.date) { return 1; }
            return 0;
        });
        res.json(news);
    } catch (error) {
        res.json({ error: error, message: 'Error occured while get news list' });
    }
});

// Get specific news article
router.get('/:url', async (req, res) => {
    try {
        const newsObject = await News.findOne({ "url": req.params.url });
        return res.json(newsObject);
    } catch (error) {
        res.json({ message: 'Failed get specific news article', error: error })
    }
});

// Submit new news object
router.post('/new', async (req, res) => {

    const newsObject = new News({
        title: req.body.title,
        date: req.body.date,
        url: req.body.url,
        content: req.body.content
    });

    try {
        await newsObject.save(err => {
            if (err) {
                res.status(500).json({ message: 'Error has occured while create news article', error: err })
            } else {
                res.status(200).json({ message: 'Successfully created news article', content: newsObject })
            }
        });
    } catch (error) {
        return res.json({ message: 'Save new news object failed', error: error });
    }
});

// Delete specific news object
router.delete('/:url', async (req, res) => {
    try {
        const removedNews = await News.remove({ url: req.params.url });
        return res.json(removedNews);
    } catch (error) {
        return res.json({ message: 'Error occured while removing news object', error: error });
    }
});

// Update specific news object
router.patch('/:url/edit', async (req, res) => {
    try {
        const updatedNewsObject = await News.updateOne(
            { "url": req.params.url },              // get the news object from database
            { $set: {                               // set the updated data
                title: req.body.title,
                date: req.body.date,
                url: req.body.url,
                content: req.body.content
            }}
        );
        return res.json(updatedNewsObject);
    } catch (error) {
        return res.json({ message: 'Update news object failed', error: error });
    }
});

module.exports = router;
