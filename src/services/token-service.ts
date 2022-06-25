import { Response } from 'express';
import JWT, { Secret } from 'jsonwebtoken';
import crypto from 'crypto';

import VerificationTokens from '../models/VerificationTokens';
import { internalErrorResponse } from '../helper/utils';

export function generateVerificationToken(user: any, res: Response, callback: Function) {
  const generatedCode = () => {
    let code = '';
    do {
      code += crypto.randomBytes(3).readUIntBE(0, 3);
    } while (code.length < 6);
    return code.slice(0, 6);
  };

  const verificationToken = new VerificationTokens({
    _userId: user._id,
    code: generatedCode(),
  });
  verificationToken.save((error: any, token: any) => {
    if (error) {
      internalErrorResponse('Save generated verification code failed.', error, res);
    } else {
      callback(token);
    }
  });
}

export function signToken(user: any): any {
  return JWT.sign(
    {
      sub: user._id,
      role: user.role,
      iss: 'http://159.65.105.150',
      directory: __dirname,
    },
    process.env.JWT_SECRET as Secret,
    { expiresIn: '30d' },
  );
}

export function deleteToken(key: string, value: string, res: Response, callback: Function) {
  VerificationTokens.deleteOne({ [key]: value }, (error) => {
    if (error) {
      internalErrorResponse('Delete verification code failed. Internal server error.', error, res);
    } else {
      callback();
    }
  });
}
