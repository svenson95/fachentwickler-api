import express, { Request, Response } from 'express';
import Posts from '../models/Posts';
import { CallbackError } from 'mongoose';
import Subjects from '../models/Subjects';
import Topics from '../models/Topics';
import { Post, PostArticle } from '../types/post';
import { TopicPopulated } from '../types/topic';
import { internalErrorResponse, okResponse, notFoundResponse, currentDate } from '../helper/utils';

const postsRouter = express.Router();

postsRouter.get('/id/:postId', async (req: Request, res: Response) => {
  Posts.findOne({ _id: req.params.postId }, { elements: 0 }).exec((error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Get post by id failed by internal server error.', error, res);
    } else if (!result) {
      notFoundResponse('Get post by id not found.', res);
    } else {
      res.json(result);
    }
  });
});

postsRouter.get('/url/:topic/:title/:type?', (req: Request, res: Response) => {
  const { topic, title, type } = req.params;
  let urlString = `${topic}/${title}`;
  if (type) urlString = `${topic}/${title}/${type}`;

  Posts.findOne({ url: urlString }, { schoolWeek: 0 })
    .populate('topicId', { links: 0 })
    .exec((error: CallbackError, result: any) => {
      if (error) {
        internalErrorResponse('Get post by url failed by internal server error.', error, res);
      } else if (!result) {
        notFoundResponse('Get post by url not found.', res);
      } else {
        res.json(result);
      }
    });
});

postsRouter.get('/multiple/:postIds', (req: Request, res: Response) => {
  Posts.find({}, { elements: 0 }).exec((error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Get multiple posts failed by internal server error.', error, res);
    } else if (!result) {
      notFoundResponse('Get multiple posts not found.', res);
    } else {
      const articleIds = req.params.postIds.split(',');
      const examLessons: Post[] = [];

      articleIds.forEach((id) => {
        const examLesson = result.find((post) => post._id == id);
        if (examLesson) examLessons.push(examLesson);
      });

      res.json(examLessons);
    }
  });
});

postsRouter.get('/all-lessons', (req: Request, res: Response) => {
  Posts.find({}, { elements: 0 })
    .sort({ lessonDate: 1 })
    .exec((error: CallbackError, result: any) => {
      if (error) {
        internalErrorResponse('Get all lesson ids failed by internal server error.', error, res);
      } else {
        const ids = result.map((el) => el._id);
        res.status(200).json(ids);
      }
    });
});

postsRouter.post('/new', async (req: Request, res: Response) => {
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
    topicId: req.body.topicId,
  });
  await post.save();

  if (req.body.type === 'test') {
    Subjects.findOne({ subject: req.body.subject })
      .populate('tests', { elements: 0, lastUpdate: 0, schoolWeek: 0 })
      .exec(async (error: CallbackError, result: any) => {
        const subjectObject: any = result.toObject();
        if (subjectObject.tests) {
          subjectObject.tests.push(post);
          subjectObject.tests.sort((a: PostArticle, b: PostArticle) => {
            if (a.lessonDate < b.lessonDate) return -1;
            if (a.lessonDate > b.lessonDate) return 1;
            return 0;
          });

          subjectObject.tests = subjectObject.tests.map((el: PostArticle) => el._id);
          await Subjects.updateOne({ subject: req.body.subject }, { $set: subjectObject });
          okResponse('Post successfully created', post, res);
        }
      });
  } else {
    Topics.findOne({ _id: req.body.topicId })
      .populate('links', { elements: 0, lastUpdate: 0, schoolWeek: 0 })
      .exec((error: CallbackError, result: any) => {
        const topicObject: any = result.toObject();
        if (topicObject.links) {
          topicObject.links.push(post);
          topicObject.links.sort((a: PostArticle, b: PostArticle) => {
            if (a.lessonDate < b.lessonDate) return -1;
            if (a.lessonDate > b.lessonDate) return 1;
            return 0;
          });

          topicObject.links = topicObject.links.map((el: PostArticle) => el._id);
          Topics.updateOne({ _id: req.body.topicId }, { $set: topicObject });
          okResponse('Post successfully created', post, res);
        }
      });
  }
});

postsRouter.patch('/:postId/edit', (req: Request, res: Response) => {
  Posts.updateOne(
    { _id: req.params.postId },
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
        topicId: req.body.topicId,
      },
    },
  ).exec((error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Update post failed.', error, res);
    } else {
      res.json(result);
    }
  });
});

postsRouter.delete('/:postId/delete', (req: Request, res: Response) => {
  Posts.findOneAndDelete({ _id: req.params.postId }).exec((postError: CallbackError, postResult: any) => {
    if (postError) {
      internalErrorResponse('Delete post failed.', postError, res);
    } else {
      Topics.findOne({ _id: postResult.topicId }).exec((topicError: CallbackError, topicResult: any) => {
        if (topicError) {
          internalErrorResponse('Get topic failed.', topicError, res);
        } else {
          const topicObject: TopicPopulated = topicResult.toObject();
          const index = topicObject.links.indexOf(postResult._id);
          if (index > -1) {
            topicObject.links.splice(index, 1);
          }

          topicObject.links.sort((a, b) => {
            if (a.lessonDate < b.lessonDate) return -1;
            if (a.lessonDate > b.lessonDate) return 1;
            return 0;
          });

          const topicToUpdate = Topics.updateOne({ _id: postResult.topicId }, { $set: topicObject }).exec(
            (updateTopicError: CallbackError, updateTopicResult: any) => {
              if (updateTopicError) {
                internalErrorResponse('Delete post failed.', updateTopicError, res);
              } else {
                okResponse('Post successfully deleted', postResult, res);
              }
            },
          );
        }
      });
    }
  });
});

export = postsRouter;
