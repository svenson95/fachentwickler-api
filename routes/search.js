const express = require('express');
const router = express.Router();
const Posts = require('../models/posts/Posts');
const Quizzes = require('../models/quiz/Quiz');
const IndexCards = require('../models/index-cards/IndexCards');

// Search all posts for specific text
router.get('/', async (req, res) => {
    const { query } = req.query;

    // Search for post-titles
    if (query === "") return [];
    const posts = await Posts.find();
    const foundPosts = [];
    const searchText = query.toLowerCase();

    posts.find(post => {
        const postTitle = post.title.toLowerCase();
        if (postTitle.includes(searchText) && !foundPosts.includes(post)) {
            foundPosts.push(post);
        }

        post.elements.find(element => {
            if (element.type === "image") return;
            if (element.type === "list") {
                if (element.content.toLowerCase().includes(searchText) && !foundPosts.includes(post)) {
                    foundPosts.push(post);
                    // pushToResults(subjects, post, foundPosts);
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
                                foundPosts.push(post);
                                // pushToResults(subjects, post, foundPosts);
                            }
                        })
                    })
                }
            }

            if (element.content && element.content.toLowerCase().includes(searchText) && !foundPosts.includes(post)) {
                foundPosts.push(post);
                // pushToResults(subjects, post, foundPosts);
            }
        })
    });

    const quizzes = await Quizzes.find();
    const indexCards = await IndexCards.find();
    const elements = [...quizzes, ...indexCards];
    elements.find(article => {
        const postTitle = article.title.toLowerCase();
        if (postTitle.includes(searchText) && !foundPosts.includes(article)) {
            foundPosts.push(article);
        }
    });

    res.json(foundPosts);
});


module.exports = router;
