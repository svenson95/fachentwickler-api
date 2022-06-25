import express, { Request, Response } from 'express';
import passport from 'passport';
require('../middleware/passport');

import Progress from '../models/Progress';
import { signToken, deleteToken } from '../services/token-service';
import {
  findUser,
  createUser,
  editUser,
  forgotPassword,
  verifyUser,
  changePassword,
  sendRegisterVerificationCode,
} from '../services/user-service';

import {
  okResponse,
  createdResponse,
  unauthorizedResponse,
  conflictResponse,
  internalErrorResponse,
} from '../helper/utils';
import { CallbackError } from 'mongoose';

const userRouter = express.Router();

userRouter.post(
  '/login',
  passport.authenticate('local', { session: false }, undefined),
  (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      const token = signToken(req.user);
      okResponse('Logged in successfully.', { user: req.user, token }, res);
    } else {
      unauthorizedResponse('Invalid username or password.', res);
    }
  },
);

userRouter.post('/register', (req: Request, res: Response) => {
  createUser(req.body, res, (createdUser) => {
    sendRegisterVerificationCode(createdUser, res, () => {
      createdResponse('Create user successful.', { user: createdUser }, res);
    });
  });
});

userRouter.get('/confirmation/:email/:code', (req: Request, res: Response) => {
  const { code, email } = req.params;
  verifyUser(code, email, res);
});

userRouter.get('/confirmation/:email/:code/:newEmail', (req: Request, res: Response) => {
  const { code, email, newEmail } = req.params;
  verifyUser(code, email, res, newEmail);
});

userRouter.post(
  '/resend-verification-code',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { email } = req.body;

    findUser('email', email, res, (userByEmail) => {
      if (userByEmail.active) {
        conflictResponse('Resend verification code failed. User is already verified.', res);
      } else {
        deleteToken('_userId', userByEmail._id, res, () => {
          sendRegisterVerificationCode(userByEmail, res, () => {
            createdResponse('Verification code successfully resent. Previous verification code deleted.', null, res);
          });
        });
      }
    });
  },
);

userRouter.post('/forgot-password', (req: Request, res: Response) => {
  forgotPassword(req.body.email, res, () => {
    createdResponse('Verification code sent.', null, res);
  });
});

userRouter.post('/change-password', (req: Request, res: Response) => {
  const { code, newPassword } = req.body;
  changePassword(code, newPassword, res);
});

userRouter.patch(
  '/edit-user',
  passport.authenticate('jwt', { session: false }, undefined),
  (req: Request, res: Response) => {
    const user = req.body;
    if (req.isAuthenticated()) {
      editUser(user, res);
    } else {
      unauthorizedResponse('Edit user failed. Not authorized.', res);
    }
  },
);

userRouter.get(
  '/logout',
  passport.authenticate('jwt', { session: false }, undefined),
  (req: Request, res: Response) => {
    okResponse('Successfully logged out', null, res);
  },
);

userRouter.post(
  '/add-progress',
  passport.authenticate('jwt', { session: false }, undefined),
  (req: Request, res: Response) => {
    const { userId, postId } = req.body;
    findUser('_id', userId, res, (user: any) => {
      if (user.progress.includes(postId)) {
        conflictResponse('Lesson is already marked as read.', res);
      } else {
        const newProgress = new Progress(req.body);
        newProgress.save((progressError: CallbackError, createProgress: any) => {
          if (progressError) {
            internalErrorResponse('Save new progress failed.', progressError, res);
          } else {
            user.progress.push(postId);
            user.save((userError: CallbackError, saveUser: any) => {
              if (userError) {
                internalErrorResponse('Save edited user progress failed.', userError, res);
              } else {
                okResponse('Added user progress successfully.', { progress: createProgress, user: saveUser }, res);
              }
            });
          }
        });
      }
    });
  },
);

userRouter.get(
  '/authenticated',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      const token = signToken(req.user);
      okResponse('Authenticated.', { user: req.user, token }, res);
    } else {
      unauthorizedResponse('Not Authorized.', res);
    }
  },
);

export = userRouter;
