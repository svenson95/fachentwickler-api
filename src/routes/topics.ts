import express, { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import { okResponse, internalErrorResponse } from '../helper/utils';
import Topics from '../models/Topics';

const topicsRouter = express.Router();

topicsRouter.post('/new', async (req: Request, res: Response) => {
  const topic = new Topics({
    title: req.body.title,
    subject: req.body.subject,
    links: req.body.links,
  });

  await topic.save().exec((error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Create topic failed.', error, res);
    } else {
      okResponse('Topic successfully created', result, res);
    }
  });
});

topicsRouter.patch('/:topicId/edit', async (req: Request, res: Response) => {
  await Topics.updateOne({ _id: req.body._id }, { $set: req.body }).exec((error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Update topic failed.', error, res);
    } else {
      okResponse('Topic successfully updated.', result, res);
    }
  });
});

topicsRouter.delete('/:topicId/delete', async (req: Request, res: Response) => {
  await Topics.find({ _id: req.params.topicId }).exec((error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Delete topic failed.', error, res);
    } else {
      okResponse('Topic successfully deleted.', result, res);
    }
  });
});

export = topicsRouter;
