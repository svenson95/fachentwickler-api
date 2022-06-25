import { Request, Response } from 'express';
import path from 'path';

const imagesHome = (req: Request, res: Response) => {
  res.sendFile(path.join(`${__dirname}/../views/image-upload.html`));
};

export = imagesHome;
