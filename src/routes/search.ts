import { Request, Response } from 'express';
import { Post, PostArticle } from '../types/post';

const express = require('express');
const Posts = require('../models/Posts');

const searchRouter = express.Router();

searchRouter.get('/', async (req: Request, res: Response) => {
  const { query } = req.query;
  if (typeof query !== 'string') return;

  const posts: PostArticle[] = await Posts.find();
  const foundPosts: Post[] = [];
  const searchText = query.toLowerCase();

  posts.find((post) => {
    const postTitle = post.title.toLowerCase();
    if (postTitle.includes(searchText) && !foundPosts.includes(post)) {
      foundPosts.push(post);
    }

    post.elements.find((element) => {
      if (element.type === 'image') return;
      if (element.type === 'list') {
        if (element?.content && element.content.toLowerCase().includes(searchText) && !foundPosts.includes(post)) {
          foundPosts.push(post);
          // pushToResults(subjects, post, foundPosts);
        }

        if (element.list) {
          // element.list.find((listItem) => {
          //   if (
          //     (listItem?.content.toLowerCase().includes(searchText) ||
          //       listItem?.toLowerCase().includes(searchText)) &&
          //     !foundPosts.includes(post)
          //   ) {
          //     pushToResults(subjects, post, foundPosts);
          //   }
          // });
        }
      } else if (element.type === 'table') {
        if (element.rows) {
          element.rows.find((row) => {
            row.columns.find((column) => {
              if (column.content.toLowerCase().includes(searchText) && !foundPosts.includes(post)) {
                foundPosts.push(post);
                // pushToResults(subjects, post, foundPosts);
              }
            });
          });
        }
      }

      if (element.content && element.content.toLowerCase().includes(searchText) && !foundPosts.includes(post)) {
        foundPosts.push(post);
        // pushToResults(subjects, post, foundPosts);
      }
    });
  });

  res.json(foundPosts);
});

export = searchRouter;
