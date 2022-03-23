const express = require('express');
const router = express.Router();
const Posts = require('../models/posts/Posts');
const Subjects = require('../models/subject/Subject');
const Topics = require('../models/topics/Topics');

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

const allArticles = async () => {
    return await Posts.find({}, { elements: 0 });
}

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find();
        console.log(posts[0]);
        res.json(posts);
    } catch (error) {
        res.json({ message: error });
    }
});

// Get mulitple articles (exam-lessons) by id array - e. g. "id1,id2,id3"
router.get('/multiple/(:arr)*', async (req, res) => {
    let articleArray = [];
    const articles = await allArticles();
    const articleIds = req.params[0].split(',');

    for (let i = 0; i < articleIds.length; i++) {
        let post = articles.find(post => String(post._id) === articleIds[i]);
        articleArray.push(post);
    }

    res.json(articleArray);
});

// Get all article ids (sorted by lessonDate in ascending order)
router.get('/all-lessons', async (req, res) => {
    try {
        const articles = await allArticles();
        articles.sort(function (a, b) {
            if (a.lessonDate < b.lessonDate) {
                return -1;
            }
            if (a.lessonDate > b.lessonDate) {
                return 1;
            }
            return 0;
        });
        const ids = articles.map(el => el._id);
        res.status(200).json(ids);
    } catch (error) {
        res.status(500).json({ message: 'Error has occured while get all lessons', error: error });
    }
});

// Submit new post
router.post('/new', async (req, res) => {
    const post = new Posts({
        url: req.body.url,
        title: req.body.title,
        description: req.body.description,
        subject: req.body.subject,
        type: req.body.type,
        lessonDate: req.body.lessonDate,
        lastUpdate: currentDate(),
        schoolWeek: req.body.schoolWeek,
        elements: req.body.elements,
        topicId: req.body.topicId
    });
    await post.save();

    if (req.body.type === "test") {
        await Subjects.findOne({ "subject": req.body.subject })
            .populate('tests', { elements: 0, lastUpdate: 0, schoolWeek: 0 })
            .exec(async (err, subject) => {
                const subjectObject = subject.toObject();
                subjectObject.tests.push(post);

                subjectObject.tests.sort(function (a, b) {
                    if (a.lessonDate < b.lessonDate) {
                        return -1;
                    }
                    if (a.lessonDate > b.lessonDate) {
                        return 1;
                    }
                    return 0;
                });
                subjectObject.tests = subjectObject.tests.map(el => el._id);

                const subjectToUpdate = await Subjects.updateOne(
                    { "subject": req.body.subject },
                    { $set: subjectObject }
                )
                res.json({
                    message: 'Post successfully created',
                    post: post,
                    updatedSubject: subjectToUpdate
                });
            });
    } else {
        await Topics.findOne({ "_id": req.body.topicId })
            .populate('links', { elements: 0, lastUpdate: 0, schoolWeek: 0 })
            .exec(async (err, topic) => {
                const topicObject = topic.toObject();
                topicObject.links.push(post);

                topicObject.links.sort(function (a, b) {
                    if (a.lessonDate < b.lessonDate) {
                        return -1;
                    }
                    if (a.lessonDate > b.lessonDate) {
                        return 1;
                    }
                    return 0;
                });
                topicObject.links = topicObject.links.map(el => el._id);

                const topicToUpdate = await Topics.updateOne(
                    { _id: req.body.topicId },
                    { $set: topicObject }
                )
                res.json({
                    message: 'Post successfully created',
                    post: post,
                    updatedTopic: topicToUpdate
                });
            });
    }
});

// Get post article
router.get('/:topic/:title', async (req, res) => {
    try {
        let urlString = req.params.topic + "/" + req.params.title;
        const post = await Posts.findOne({ "url": urlString }, { schoolWeek: 0 }).populate('topicId', { links: 0 });
        res.json(post);
    } catch (error) {
        res.json({
            message: 'Post not found',
            error: error
        });
    }
});

// Get post quiz, index-cards or matching
router.get('/:topic/:title/:type', async (req, res) => {
    try {
        let urlString = req.params.topic + "/" + req.params.title + "/" + req.params.type;
        const post = await Posts.findOne({ "url": urlString }, { schoolWeek: 0 }).populate('topicId', { links: 0 });
        res.json(post);
    } catch (error) {
        res.json({
            message: 'Post not found',
            error: error
        });
    }
});

// Get specific article by id
router.get('/:postId', async (req, res) => {
    try {
        const posts = await allArticles();
        const post = posts.find(el => String(el._id) === req.params.postId);
        res.json(post);
    } catch (error) {
        res.json({
            message: 'Post not found (by id)',
            error: error
        });
    }
});

// Delete specific post
router.delete('/:postId/delete', async (req, res) => {
    try {
        const removedPost = await Posts.findOneAndDelete({ _id: req.params.postId });
        const topic = await Topics.findOne({ _id: removedPost.topicId });
        const topicObject = topic.toObject();
        const index = topic.links.indexOf(removedPost._id);
        if (index > -1) {
            topicObject.links.splice(index, 1);
        }

        topicObject.links.sort(function (a, b) {
            if (a.lessonDate < b.lessonDate) {
                return -1;
            }
            if (a.lessonDate > b.lessonDate) {
                return 1;
            }
            return 0;
        });

        const topicToUpdate = await Topics.updateOne(
            { _id: removedPost.topicId },
            { $set: topicObject }
        )

        res.json({
            message: "Post successfully removed",
            removedPost: removedPost,
            updatedTopic: topicToUpdate
        });
    } catch (error) {
        res.json({
            message: "Delete post failed. Try again",
            error: error
        });
    }
});

// Update a post
router.patch('/:postId/edit', async (req, res) => {
    try {
        const updatedPost = await Posts.updateOne(
            { "_id": req.params.postId },
            {
                $set: {
                    url: req.body.url,
                    title: req.body.title,
                    description: req.body.description,
                    subject: req.body.subject,
                    type: req.body.type,
                    lessonDate: req.body.lessonDate,
                    lastUpdate: currentDate(),
                    schoolWeek: req.body.schoolWeek,
                    elements: req.body.elements,
                    topicId: req.body.topicId   // we send the topicId to update the related topic object in database
                }
            }
        );
        res.json(updatedPost);
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;
