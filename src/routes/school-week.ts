import express, { Request, Response } from 'express';
import { internalErrorResponse } from '../helper/utils';
import { SchoolWeek } from '../types/school-week';
import Posts from '../models/Posts';
import { CallbackError } from 'mongoose';
const schoolweekRouter = express.Router();

schoolweekRouter.get('/week/:number', (req: Request, res: Response) => {
  Posts.find({ schoolWeek: req.params.number }, { elements: 0 })
    .sort({ lessonDate: 1 })
    .exec((error: CallbackError, result: any) => {
      if (error) {
        internalErrorResponse('Get school week by number failed.', error, res);
      } else {
        const week: SchoolWeek = {
          schoolWeek: Number(req.params.number),
          posts: result,
        };
        res.status(200).json(week);
      }
    });
});

schoolweekRouter.get('/all', async (req, res) => {
  Posts.find({}, { elements: 0 })
    .sort({ lessonDate: 1 })
    .exec((error: CallbackError, result: any) => {
      if (error) internalErrorResponse('Get all school weeks failed.', error, res);

      const weeksArray: SchoolWeek[] = [];
      result.forEach((post) => {
        if (post.schoolWeek > 0) {
          const weekObj = weeksArray.find((week) => week.schoolWeek == post.schoolWeek);

          if (weekObj) {
            weekObj.posts.push(post);
          } else {
            weeksArray.push({
              schoolWeek: post.schoolWeek,
              posts: [post],
            });
          }
        }
      });

      weeksArray.sort((a, b) => {
        if (Number(a.schoolWeek) > Number(b.schoolWeek)) return 1;
        if (Number(a.schoolWeek) < Number(b.schoolWeek)) return -1;
        return 0;
      });

      res.status(200).json(weeksArray);
    });
});

export = schoolweekRouter;
