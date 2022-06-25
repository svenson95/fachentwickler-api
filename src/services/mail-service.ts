import { Response } from 'express';
import nodemailer from 'nodemailer';
import { internalErrorResponse } from '../helper/utils';
import { NodemailerMailOptions } from '../types/nodemailer-mailoptions';

export function sendEmail(content: NodemailerMailOptions, res: Response, callback: Function) {
  const transporter = nodemailer.createTransport({
    port: 465, // true for 465, false for other ports
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    secure: true,
  });

  transporter.sendMail(content, (sendError) => {
    if (sendError) {
      internalErrorResponse('Send E-Mail failed. Internal server error.', sendError, res);
    } else {
      callback();
    }
  });
}
