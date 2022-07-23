import { Request, Response } from 'express';
import upload from '../middleware/upload';

const uploadFile = async (req: Request, res: Response) => {
  await upload(req, res);

  if (req.file === undefined) {
    return res.status(400).send('You must select a file.');
  } else {
    return res.json({ message: 'Image successfully uploaded', file: req.file });
  }
};

export = uploadFile;
