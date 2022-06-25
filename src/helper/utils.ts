import { Response } from 'express';
import { Post } from '../types/post';
import Posts from '../models/Posts';

export async function allArticles(): Promise<Post[]> {
  return await Posts.find({}, { elements: 0 });
}

export function currentDate(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  let dd: string | number = today.getDate();
  let mm: string | number = today.getMonth() + 1;

  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${yyyy}-${mm}-${dd}`;
}

function sendResponse(
  response: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: any,
  error?: Error,
): void {
  response.status(statusCode).json({
    success,
    message,
    data,
    error,
  });
}

export function okResponse(message: string, data: any, res: Response): void {
  sendResponse(res, 200, true, message, data);
}

export function createdResponse(message: string, data: any, res: Response) {
  sendResponse(res, 201, true, message, data);
}

export function unauthorizedResponse(message: string, res: Response): void {
  sendResponse(res, 401, false, message, null);
}

export function notFoundResponse(message: string, res: Response): void {
  sendResponse(res, 404, false, message, null);
}

export function conflictResponse(message: string, res: Response): void {
  sendResponse(res, 409, false, message, null);
}

export function internalErrorResponse(message: string, error: Error, res: Response): void {
  sendResponse(res, 500, false, message, null, error);
}
