import mongoose from 'mongoose';
import { schoolusers } from '../helper/mongodb.interface';

const expireDate = () => {
  const now = new Date();
  return now.setTime(now.getTime() + 86400);
};

const TokenSchema = new mongoose.Schema({
  _userId: { type: String, required: true },
  code: { type: String, required: true },
  expire_at: { type: Date, default: expireDate() },
});

const VerificationTokens = schoolusers.model('verification-token', TokenSchema);

VerificationTokens.schema.index({ expire_at: 1 }, { expireAfterSeconds: 86400 });

export = VerificationTokens;
