import express, { Response, Request } from 'express';
import Subjects from '../models/Subjects';
import { CallbackError, Document, HydratedDocument } from 'mongoose';
import { internalErrorResponse, notFoundResponse, okResponse } from '../helper/utils';
import { SubjectUnpopulated } from '../types/subject';

const subjectsRouter = express.Router();

subjectsRouter.get('/:subject/populated', (req: Request, res: Response) => {
  const { subject } = req.params;
  console.log(subject);
  Subjects.findOne({ subject: subject })
    .populate({ path: 'tests', select: '_id url lessonDate title type' })
    .populate({
      path: 'topics',
      select: 'title',
      populate: {
        path: 'links',
        select: '_id url lessonDate title type',
      },
    })
    .exec((error: CallbackError, result: any) => {
      if (error) {
        internalErrorResponse('Get populated subject failed.', error, res);
      } else if (!result) {
        notFoundResponse('No subject found.', res);
      } else {
        okResponse('Populated subject fetched.', result, res);
      }
    });
});

subjectsRouter.post('/new', (req: Request, res: Response) => {
  const sub = new Subjects(req.body);
  sub.save().exec((error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Create subject failed.', error, res);
    } else {
      okResponse('Subject created.', result, res);
    }
  });
});

subjectsRouter.patch('/:subjectId/edit', (req: Request, res: Response) => {
  const { subjectId } = req.body;
  Subjects.updateOne({ _id: subjectId }, { $set: req.body }).exec((error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Edit subject failed.', error, res);
    } else {
      okResponse('Edit subject succeed.', result, res);
    }
  });
});

subjectsRouter.delete('/:subjectId/delete', (req: Request, res: Response) => {
  const { subjectId } = req.params;
  Subjects.find({ _id: subjectId }).exec((error, result) => {
    if (error) {
      internalErrorResponse('Delete subject failed.', error, res);
    } else {
      okResponse('Subject deleted.', result, res);
    }
  });
});

export = subjectsRouter;
