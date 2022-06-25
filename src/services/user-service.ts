import { Response } from 'express';
import { CallbackError } from 'mongoose';

import VerificationTokens from '../models/VerificationTokens';
import Users from '../models/Users';

import { NodemailerMailOptions } from '../types/nodemailer-mailoptions';
import { UserData } from '../types/user';

import { generateVerificationToken, signToken, deleteToken } from './token-service';
import { sendEmail } from './mail-service';

import verificationMailView from '../views/verification-email';
import changeEmailView from '../views/change-email';
import changePasswordView from '../views/change-password';

import {
  okResponse,
  createdResponse,
  unauthorizedResponse,
  notFoundResponse,
  conflictResponse,
  internalErrorResponse,
} from '../helper/utils';
import { VerificationToken } from '../types/token';

export function findUser(key: string, value: string, res: Response, callback: Function) {
  Users.findOne({ [key]: value }, (error: CallbackError, result: any) => {
    if (error) {
      internalErrorResponse('Find user failed. Internal server error.', error, res);
    } else if (!result) {
      notFoundResponse('Find user failed. User not found.', res);
    } else {
      callback(result);
    }
  });
}

export function saveUser(user: any, res: Response, callback: Function) {
  user.save({ _id: user._id }, (error: CallbackError, savedUser: UserData) => {
    if (error) {
      internalErrorResponse('Save user failed. Internal server error.', error, res);
    } else if (!savedUser) {
      notFoundResponse('Save user failed. User not found.', res);
    } else {
      callback(savedUser);
    }
  });
}

export function createUser(_user: any, res: Response, callback: Function) {
  Users.findOne({ name: _user.name }, (nameError: CallbackError, userByName: UserData) => {
    if (nameError) {
      internalErrorResponse('Create user failed (1). Internal server error.', nameError, res);
    } else if (userByName) {
      conflictResponse('Create user failed. Name is already taken.', res);
    } else {
      Users.findOne({ email: _user.email }, (emailError: CallbackError, userByEmail: UserData) => {
        if (emailError) {
          internalErrorResponse('Create user failed (2). Internal server error.', emailError, res);
        } else if (userByEmail) {
          conflictResponse('Create user failed. E-Mail is already taken.', res);
        } else {
          const newUser = new Users({
            name: _user.name,
            password: _user.password,
            role: _user.role,
            email: _user.email,
            theme: _user.theme,
          });
          newUser.save((createError: CallbackError, createdUser: any) => {
            if (createError) {
              internalErrorResponse('Create user failed (3). Internal server error.', createError, res);
            } else {
              callback(createdUser);
            }
          });
        }
      });
    }
  });
}

export function forgotPassword(email: string, res: Response, callback: Function) {
  findUser('email', email, res, (userByEmail: UserData) => {
    generateVerificationToken(userByEmail, res, (token: VerificationToken) => {
      const mailOptions: NodemailerMailOptions = {
        from: 'no-reply@example.com',
        to: userByEmail.email,
        subject: 'Passwort ändern',
        text: 'xxx',
        html: changePasswordView.html(userByEmail, token),
      };

      sendEmail(mailOptions, res, () => {
        callback();
      });
    });
  });
}

export function editUser(user: any, res: Response) {
  findUser('_id', user._id, res, (userById: UserData) => {
    if (user.newName) {
      Users.findOne({ name: user.newName }, (nameError: CallbackError, userByName: any) => {
        if (nameError) {
          internalErrorResponse('Edit user name failed. Internal server error.', nameError, res);
        } else if (userByName) {
          conflictResponse('Edit user name failed. Name is already taken.', res);
        } else {
          const editedUser = userById;
          editedUser.name = user.newName;
          saveUser(editedUser, res, (savedUser: UserData) => {
            okResponse('Edit user name successful.', { user: savedUser }, res);
          });
        }
      });
    }

    if (user.email) {
      Users.findOne({ email: user.email }, (emailError: CallbackError, userByEmail: any) => {
        if (emailError) {
          internalErrorResponse('Edit user email failed. Internal server error.', emailError, res);
        } else if (userByEmail) {
          conflictResponse('Edit user email failed. Name is already taken.', res);
        } else {
          const editedUser = userById;
          editedUser.email = user.email;
          sendChangeEmailVerificationCode(editedUser, res);
        }
      });
    }

    if (user.password) {
      const editedUser = userById;
      editedUser.password = user.password;
      saveUser(editedUser, res, (savedUser: UserData) => {
        okResponse('Edit user password successful.', { user: savedUser }, res);
      });
    }

    if (user.progress) {
      const editedUser = userById;
      editedUser.progress = user.progress;
      saveUser(editedUser, res, (savedUser: UserData) => {
        okResponse('Edit user progress successful.', { user: savedUser }, res);
      });
    }

    if (user.theme) {
      const editedUser = userById;
      editedUser.theme = user.theme;
      saveUser(editedUser, res, (savedUser: UserData) => {
        okResponse('Edit user theme successful.', { user: savedUser }, res);
      });
    }
  });
}

export function sendRegisterVerificationCode(newUser: any, res: Response, callback: Function) {
  generateVerificationToken(newUser, res, (token: VerificationToken) => {
    const mailOptions = {
      from: 'no-reply@example.com',
      to: newUser.email,
      subject: 'Ihre Anmeldung auf fachentwickler',
      text: 'xxx',
      html: verificationMailView.html(newUser, token),
    };

    sendEmail(mailOptions, res, () => {
      callback();
    });
  });
}

export function sendChangeEmailVerificationCode(newUser: any, res: Response) {
  generateVerificationToken(newUser, res, (token: VerificationToken) => {
    const mailOptions = {
      from: 'no-reply@example.com',
      to: newUser.email,
      subject: 'E-Mail Adresse ändern',
      text: 'xxx',
      html: changeEmailView.html(newUser, token),
    };

    sendEmail(mailOptions, res, () => {
      createdResponse('Verification code successfully created & sent', null, res);
    });
  });
}

export function verifyUser(code: string, email: string, res: Response, newEmail: string | null = null) {
  VerificationTokens.findOne({ code }, (error: CallbackError, token: VerificationToken) => {
    if (!token) {
      unauthorizedResponse('Verify user failed. Matching verification code not found.', res);
    } else {
      findUser('_id', token._userId, res, async (userById: UserData) => {
        if (userById.active !== true) {
          const editedUser = userById;
          editedUser.active = true;
          saveUser(editedUser, res, (savedUser: UserData) => {
            deleteToken('code', token.code, res, () => {
              okResponse('Verify user successful.', { user: savedUser }, res);
            });
          });
        } else if (userById.active === true && newEmail !== null) {
          console.log('right case');
          const editedUser = userById;
          editedUser.email = newEmail;
          saveUser(editedUser, res, (savedUser: UserData) => {
            deleteToken('code', token.code, res, () => {
              okResponse('Verify new user email successful.', { user: savedUser }, res);
            });
          });
        } else if (userById.active === true) {
          conflictResponse('Verify user failed. User is already verified.', res);
        }
      });
    }
  });
}

export function changePassword(code: string, newPassword: string, res: Response) {
  VerificationTokens.findOne({ code }, (error: CallbackError, token: VerificationToken) => {
    if (error) {
      internalErrorResponse('Change user password failed. Internal server error.', error, res);
    } else if (!token) {
      unauthorizedResponse('Change user password failed. Matching verification code not found.', res);
    } else {
      findUser('_id', token._userId, res, (userById: UserData) => {
        const editedUser = userById;
        editedUser.password = newPassword;
        saveUser(editedUser, res, (savedUser: UserData) => {
          deleteToken('code', token.code, res, () => {
            okResponse('Change user password successful.', { user: savedUser }, res);
          });
        });
      });
    }
  });
}
