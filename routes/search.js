const express = require('express');
const router = express.Router();
const Posts = require('../models/posts/Posts');
const Subjects = require('../models/subject/Subject');

// Search all posts for specific text
router.get('/:text', async (req, res) => {
    try {
        if (req.params.text === "") return [];
        const subjects = await Subjects.find();
        const foundPosts = [];
        const searchText = req.params.text.toLowerCase();
        subjects.find(subject => {
            subject.topics.find(topic => {
                topic.links.find(post => {
                    const postTitle = post.title.toLowerCase();
                    if (postTitle.includes(searchText) && !foundPosts.includes(post)) {
                        post.subject = subject.subject;
                        foundPosts.push(post);
                    }
                })
            })
        });
        const posts = await Posts.find();
        posts.find(post => {
            post.elements.find(element => {
                if (element.type === "image") return;
                if (element.content.toLowerCase().includes(searchText)) {
                    subjects.find(subject => {
                        subject.topics.find(topic => {
                            topic.links.find(subjectPost => {
                                if (subjectPost.url === post.url && !foundPosts.includes(subjectPost)) {
                                    subjectPost.subject = subject.subject;
                                    foundPosts.push(subjectPost);
                                }
                            })
                        })
                    })
                }
                if (element.content.list) {
                    element.content.list.find(el => {
                        if (el.toLowerCase().includes(searchText)) {
                            subjects.find(subject => {
                                subject.topics.find(topic => {
                                    topic.links.find(subjectPost => {
                                        if (subjectPost.url === post.url && !foundPosts.includes(subjectPost)) {
                                            subjectPost.subject = subject.subject;
                                            foundPosts.push(subjectPost);
                                        }
                                    })
                                })
                            })
                        }
                    })
                }
            })
        });
        res.json(foundPosts);
    } catch (error) {
        res.json({ error: true, message: "No posts found" + error });
    }
});


module.exports = router;
