import express, { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import { internalErrorResponse, notFoundResponse, okResponse } from '../helper/utils';
import News from '../models/News';
import { SchoolNews } from '../types/news';

const newsRouter = express.Router();

newsRouter.get('/latest', (req: Request, res: Response) => {
  News.find({}, { content: 0 })
    .sort({ date: -1 })
    .limit(1)
    .exec((error: CallbackError, result: any) => {
      if (error) {
        internalErrorResponse('Get latest news failed.', error, res);
      } else {
        res.json(result);
      }
    });
});

newsRouter.get('/all', (req: Request, res: Response) => {
  const { page, size } = req.query;

  News.find({}, { content: 0 })
    .sort({ date: -1 })
    .skip(Number(page) * Number(size))
    .limit(Number(size))
    .exec((error: CallbackError, result: any) => {
      if (error) {
        internalErrorResponse('Get all news failed.', error, res);
      } else {
        res.json(result);
      }
    });
});

newsRouter.get('/count', (req: Request, res: Response) => {
  News.count().exec((error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Get news count failed.', error, res);
    } else {
      res.json(result);
    }
  });
});

newsRouter.get('/:url', (req: Request, res: Response) => {
  News.findOne({ url: req.params.url }, (error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Get news by url failed.', error, res);
    } else {
      res.json(result);
    }
  });
});

newsRouter.post('/new', (req: Request, res: Response) => {
  const newsObject = new News({
    title: req.body.title,
    date: req.body.date,
    url: req.body.url,
    content: req.body.content,
  });

  newsObject.save((error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Create news failed.', error, res);
    } else {
      okResponse('News created successfully.', result, res);
    }
  });
});

newsRouter.patch('/:url/edit', (req: Request, res: Response) => {
  News.updateOne(
    { url: req.params.url }, // get the news object from database
    {
      $set: {
        // set the updated data
        title: req.body.title,
        date: req.body.date,
        url: req.body.url,
        content: req.body.content,
      },
    },
  ).exec((error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Update news failed.', error, res);
    } else {
      res.json(result);
    }
  });
});

newsRouter.delete('/:url', (req: Request, res: Response) => {
  News.deleteOne({ url: req.params.url }, (error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Delete news failed.', error, res);
    } else {
      res.json(result);
    }
  });
});

export = newsRouter;
