import express, { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import { internalErrorResponse, okResponse } from '../helper/utils';
import ExamDates from '../models/ExamDates';

const examdatesRouter = express.Router();

examdatesRouter.get('/', (req: Request, res: Response) => {
  ExamDates.find().exec((error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Get exam dates failed.', error, res);
    } else {
      res.json(result);
    }
  });
});

examdatesRouter.post('/add', (req: Request, res: Response) => {
  const examDate = new ExamDates(req.body);

  examDate.save().exec((error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Create exam date failed.', error, res);
    } else {
      okResponse('Exam date successfully created.', result, res);
    }
  });
});

export = examdatesRouter;
