const express = require('express');
const router = express.Router();
const Subjects = require('../models/subject/Subject');

// Search all posts for specific text
router.get('/:text', async (req, res) => {
    try {
        if (req.params.text === "") return [];
        const subjects = await Subjects.find();
        const foundPosts = [];
        const searchText = req.params.text.toLowerCase();
        subjects.filter(() => {
            const withoutBackups = subjects.filter(subject => subject.subject.substr(-6) !==  "backup");
            withoutBackups.find(subject => {
                subject.topics.find(topic => {
                    topic.links.find(post => {
                        const postTitle = post.title.toLowerCase();
                        if (postTitle.includes(searchText) && !foundPosts.includes(post)) {
                            post.subject = subject.subject;
                            foundPosts.push(post);
                        }
                        if (post.elements) {
                            post.elements.find(element => {
                                const postContent = element.content.toLowerCase();
                                if (postContent.includes(searchText) && !foundPosts.includes(post)) {
                                    post.subject = subject.subject;
                                    foundPosts.push(post);
                                }
                            })
                        }
                    })
                })
            })
        });
        console.log(foundPosts);
        res.json(foundPosts);
    } catch (error) {
        res.json({ error: true, message: "No posts found" + error });
    }
});


module.exports = router;
