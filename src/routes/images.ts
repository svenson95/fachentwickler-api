import express, { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import { internalErrorResponse, notFoundResponse, okResponse } from '../helper/utils';
import imagesHome from '../controllers/images-home';
import uploadFile from '../controllers/upload';
import PhotoChunks from '../models/Photos.chunks';
import PhotoFiles from '../models/Photos.files';

const imagesRouter = express.Router();

imagesRouter.get('/', imagesHome);

imagesRouter.get('/all', (req, res) => {
  const { page, size, sort } = req.query;

  PhotoFiles.find()
    .sort({ $natural: sort === 'ascending' ? 1 : -1 })
    .skip(Number(page) * Number(size))
    .limit(Number(size))
    .exec((error, result) => {
      if (error) {
        internalErrorResponse('Get multiple photos failed.', error, res);
      } else {
        res.json(result);
      }
    });
});

imagesRouter.get('/count', (req: Request, res: Response) => {
  PhotoFiles.count().exec((error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Get images count failed.', error, res);
    } else {
      res.json(result);
    }
  });
});

imagesRouter.get('/:id', (req: Request, res: Response) => {
  PhotoFiles.findOne({ _id: req.params.id }, (filesError: CallbackError, filesResult: any) => {
    if (filesError) {
      internalErrorResponse('Get photo file failed.', filesError, res);
    } else if (!filesResult) {
      notFoundResponse('Photo file not found.', res);
    } else {
      PhotoChunks.find({ files_id: req.params.id }, (chunksError: CallbackError, chunksResult: any) => {
        if (chunksError) {
          internalErrorResponse('Get photo chunks failed.', chunksError, res);
        } else if (!chunksResult) {
          notFoundResponse('Photo chunks not found.', res);
        } else {
          res.status(200).json({
            files: filesResult,
            chunks: chunksResult,
          });
        }
      });
    }
  });
});

imagesRouter.post('/upload', uploadFile);

imagesRouter.delete('/:id/delete', (req: Request, res: Response) => {
  PhotoFiles.deleteOne({ _id: req.params.id }, (filesError, filesResult) => {
    if (filesError) {
      internalErrorResponse('Delete photo file failed.', filesError, res);
    } else {
      PhotoChunks.deleteOne({ files_id: req.params.id }, (chunksError, chunksResult) => {
        if (chunksError) {
          internalErrorResponse('Delete photo chunks failed.', chunksError, res);
        } else {
          okResponse(
            'Image successfully removed.',
            {
              chunks: chunksResult,
              files: filesResult,
            },
            res,
          );
        }
      });
    }
  });
});

export = imagesRouter;
