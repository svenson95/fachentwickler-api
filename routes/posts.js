const express = require('express');
const router = express.Router();
const Posts = require('../models/posts/Posts');
const Subjects = require('../models/subject/Subject');
const Quizzes = require('../models/quiz/Quiz');
const IndexCards = require('../models/index-cards/IndexCards');

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

// Get all the posts
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find();
        res.json(posts);
    } catch (error) {
        res.json({ message: error });
    }
});

// Get specific test
router.get('/:subject/:topic/test', async (req, res) => {
    const subjectWithPost = await Subjects.findOne({ subject: req.params.subject });
    const testDetails = await subjectWithPost.tests.find(el => el.url === req.params.topic + "/" + req.params.post || el.url === req.params.topic + "/test");
    if (testDetails === undefined) {
        subjectWithPost.tests.find(el => el.url === req.params.topic + "/test")
    }
    try {
        const testUrl = req.params.topic + "/test";
        const post = await Posts.findOne({ "url": testUrl });
        res.json({
            title: testDetails?.title,
            description: testDetails?.description,
            topic: post.topic,
            subject: post.subject,
            lessonDate: post.lessonDate,
            lastUpdate: post.lastUpdate,
            url: post.url,
            elements: post.elements,
            _id: post._id
        });
    } catch (error) {
        res.json({ message: error });
    }
});

// Get specific post
router.get('/:subject/:topic/:post', async (req, res) => {
    const postSubject = await Subjects.findOne({ subject: req.params.subject });
    const subjectTopics = postSubject.topics.flatMap(el => el.links);
    const postDetails = await subjectTopics.find(el => el.url === req.params.topic + "/" + req.params.post || el.url === req.params.topic + "/test");
    if (postDetails === undefined) {
        postSubject.tests.find(el => el.url === req.params.topic + "/test")
    }
    try {
        const urlString = req.params.topic + "/" + req.params.post;
        const post = await Posts.findOne({ "url": urlString });
        res.json({
            title: postDetails.title,
            description: postDetails.description,
            topic: post.topic,
            subject: post.subject,
            lessonDate: post.lessonDate,
            lastUpdate: post.lastUpdate,
            url: post.url,
            elements: post.elements,
            _id: post._id
        });
    } catch (error) {
        res.json({ message: error });
    }
});

// Get all post ids (sorted in ascending lessonDate order)
router.get('/all-lessons', async (req, res) => {
    try {
        const posts = await Posts.find();
        const quizzes = await Quizzes.find();
        const indexCards = await IndexCards.find();
        const objects = [...posts, ...quizzes, ...indexCards];
        objects.sort(function(a, b) {
            if (a.lessonDate < b.lessonDate) { return -1; }
            if (a.lessonDate > b.lessonDate) { return 1; }
            return 0;
        });
        res.status(200).json(posts.map(el => el._id));
    } catch(error) {
        res.status(500).json({ message: 'Error has occured while get all lessons', error: error });
    }
});

// Get latest 3 school weeks posts
router.get('/last-school-weeks', async (req, res) => {
    try {
        const posts = await Posts.find();
        const quizzes = await Quizzes.find();
        const indexCards = await IndexCards.find();
        const objects = [...posts, ...quizzes, ...indexCards];
        const subjects = await Subjects.find();
        const weeksArray = [];
        objects.forEach(post => {
            if (post.schoolWeek > 0) {
                const weekObj = weeksArray.find(week => week.schoolWeek === post.schoolWeek);
                if (weekObj) {
                    const subject = subjects.find(sub => sub.subject === post.subject);
                    const _postId = String(post._id);
                    const topic = subject.topics.find(topic => topic.links.find(link => link.postId === _postId));
                    let subPost = topic?.links.find(link => link.postId === _postId);
                    if (!subPost) subPost = subject.tests.find(test => test.postId === _postId);
                    weekObj.posts.push({
                        id: post._id,
                        details: subPost,
                        schoolWeek: post.schoolWeek,
                        lessonDate: post.lessonDate,
                        subject: post.subject
                    });
                } else {
                    const subject = subjects.find(sub => sub.subject === post.subject);
                    const _postId = String(post._id);
                    const topic = subject.topics.find(topic => topic.links.find(link => link.postId === _postId));
                    let subPost = topic?.links.find(link => link.postId === _postId);
                    if (!subPost) subPost = subject.tests.find(test => test.postId === _postId);
                    weeksArray.push({
                        schoolWeek: post.schoolWeek,
                        posts: [{
                            id: post._id,
                            details: subPost,
                            schoolWeek: post.schoolWeek,
                            lessonDate: post.lessonDate,
                            subject: post.subject
                        }]
                    })
                }
            }
        });
        weeksArray.sort(function(a, b) {
            if (Number(a.schoolWeek) < Number(b.schoolWeek)) { return 1; }
            if (Number(a.schoolWeek) > Number(b.schoolWeek)) { return -1; }
            return 0;
        });
        const lastWeeks = weeksArray.slice(0, 3);
        for (let i = 0; i < weeksArray.length; i++) {
            weeksArray[i].posts.sort(function(a, b) {
                if (a.lessonDate < b.lessonDate) { return 1; }
                if (a.lessonDate > b.lessonDate) { return -1; }
                return 0;
            });
        }
        res.status(200).json(lastWeeks);
    } catch(error) {
        res.status(500).json({ message: 'Error has occured while get last school-weeks (posts)', error: error });
    }
});

// Get all school weeks (history)
router.get('/all-school-weeks', async (req, res) => {
    try {
        const posts = await Posts.find();
        const quizzes = await Quizzes.find();
        const indexCards = await IndexCards.find();
        const objects = [...posts, ...quizzes, ...indexCards];
        const subjects = await Subjects.find();
        const weeksArray = [];
        objects.forEach(post => {
            if (post.schoolWeek > 0) {
                const weekObj = weeksArray.find(week => week.schoolWeek === post.schoolWeek);
                if (weekObj) {
                    const subject = subjects.find(sub => sub.subject === post.subject);
                    const _postId = String(post._id);
                    const topic = subject.topics.find(topic => topic.links.find(link => link.postId === _postId));
                    let subPost = topic?.links.find(link => link.postId === _postId);
                    if (!subPost) subPost = subject.tests.find(test => test.postId === _postId);
                    weekObj.posts.push({
                        id: post._id,
                        details: subPost,
                        schoolWeek: post.schoolWeek,
                        lessonDate: post.lessonDate,
                        subject: post.subject
                    });
                } else {
                    const subject = subjects.find(sub => sub.subject === post.subject);
                    const _postId = String(post._id);
                    const topic = subject.topics.find(topic => topic.links.find(link => link.postId === _postId));
                    let subPost = topic?.links.find(link => link.postId === _postId);
                    if (!subPost) subPost = subject.tests.find(test => test.postId === _postId);
                    weeksArray.push({
                        schoolWeek: post.schoolWeek,
                        posts: [{
                            id: post._id,
                            details: subPost,
                            schoolWeek: post.schoolWeek,
                            lessonDate: post.lessonDate,
                            subject: post.subject
                        }]
                    })
                }
            }
        });
        weeksArray.sort(function(a, b) {
            if (Number(a.schoolWeek) > Number(b.schoolWeek)) { return 1; }
            if (Number(a.schoolWeek) < Number(b.schoolWeek)) { return -1; }
            return 0;
        });
        await weeksArray.forEach(week => {
            week.posts.sort(function(a, b) {
                if (a.lessonDate > b.lessonDate) { return 1; }
                if (a.lessonDate < b.lessonDate) { return -1; }
                return 0;
            });
        })
        res.status(200).json(weeksArray);
    } catch(error) {
        res.status(500).json({ message: 'Error has occured while get all school-weeks (posts)', error: error });
    }
});

// Submit new post
router.post('/:subject/:topic/new', async (req, res) => {

    const post = new Posts({
        url: req.body.url,
        topic: req.body.topic,
        subject: req.body.subject,
        lessonDate: req.body.lessonDate,
        lastUpdate: currentDate(),
        elements: req.body.elements
    });

    const subjectWithPost = await Subjects.findOne({ subject: req.params.subject });
    const subjectLinks = subjectWithPost.topics.flatMap(el => el.links) || subjectWithPost.tests;
    const postDetails = await subjectLinks.find(el => el.url === req.body.url);

    try {
        await post.save();
        res.json({
            title: postDetails.title,
            description: postDetails.description,
            post: post
        });
    } catch (error) {
        res.json({ message: error });
    }
});

// Delete specific post
router.delete('/:subject/:topic/:post*', async (req, res) => {
    const urlString = req.params.topic + "/" + req.params.post;
    try {
        const removedPost = await Posts.remove({ "url": urlString });
        res.json({ message: "Post successfully removed", post: removedPost });
    } catch (error) {
        res.json({ message: "Delete post failed", error: error });
    }
});

// Update a post
router.patch('/:subject/:topic/:post/edit', async (req, res) => {
    const reqString = req.params.subject + "/" + req.params.topic + "/" + req.params.post;
    const urlString = req.params.topic + "/" + req.params.post;
    const testString = req.params.topic + "/test"; // subject -> topic in this case, since subject is
    try {
        if (reqString.endsWith('/test')) {
            const updatedTest = await Posts.updateOne(
                { "url": testString },                  // get the test
                { $set: {                               // set the changed test
                        url: req.body.url,
                        topic: req.body.topic,
                        subject: req.body.subject,
                        lessonDate: req.body.lessonDate,
                        lastUpdate: currentDate(),
                        elements: req.body.elements,
                    }}
            );
            res.json(updatedTest);
        } else {
            const updatedPost = await Posts.updateOne(
                { "url": urlString },                   // get the post
                { $set: {                               // set the changed post
                        url: req.body.url,
                        topic: req.body.topic,
                        subject: req.body.subject,
                        lessonDate: req.body.lessonDate,
                        lastUpdate: currentDate(),
                        elements: req.body.elements,
                    }}
            );
            res.json(updatedPost);
        }
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;
