const express = require('express');
const router = express.Router();
const Posts = require('../models/posts/Posts');
const Subjects = require('../models/subject/Subject');

function pushToResults(_subjects, _post, _foundPosts) {
    _subjects.find(subject => {
        subject.topics.find(topic => {
            topic.links.find(subjectPost => {
                if (subjectPost.url === _post.url && !_foundPosts.includes(subjectPost)) {
                    subjectPost.subject = subject.subject;
                    _foundPosts.push(subjectPost);
                }
            })
        })
    })
}

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
                if (element.type === "list") {
                    if (element.content.toLowerCase().includes(searchText) && !foundPosts.includes(post)) {
                        pushToResults(subjects, post, foundPosts);
                    }

                    if (element.list) {
                        // element.list.find(listItem => {
                        //     if (
                        //         (listItem?.content.toLowerCase().includes(searchText) || listItem?.toLowerCase().includes(searchText))
                        //         &&
                        //         !foundPosts.includes(post)
                        //     ) {
                        //         pushToResults(subjects, post, foundPosts);
                        //     }
                        // })
                    }

                } else if (element.type === 'table') {
                    if (element.rows) {
                        element.rows.find(row => {
                            row.columns.find(column => {
                                if (column.content.toLowerCase().includes(searchText) && !foundPosts.includes(post)) {
                                    pushToResults(subjects, post, foundPosts);
                                }
                            })
                        })
                    }
                }

                if (element.content.toLowerCase().includes(searchText) && !foundPosts.includes(post)) {
                    pushToResults(subjects, post, foundPosts);
                }
            })
        });
        res.json(foundPosts);
    } catch (error) {
        res.json({ error: true, message: error });
    }
});


module.exports = router;
