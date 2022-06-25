import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Progress from './Progress';
import { schoolusers } from '../helper/mongodb.interface';
import { Theme, UserRole } from '../types/user';

const UserSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    min: 4,
    max: 15,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: UserRole,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  progress: [{ type: mongoose.Schema.Types.ObjectId, ref: Progress }],
  theme: {
    type: String,
    enum: [Theme],
  },
});

UserSchema.pre('save', function _(this: any, next: Function) {
  if (!this.isModified('password')) {
    // its already hashed
    return next();
  }
  // eslint-disable-next-line consistent-return
  bcrypt.hash(this.password, 10, (err: Error | undefined, encrypted: string): any => {
    if (err) return next(err);
    this.password = encrypted;
    next();
  });
});

UserSchema.methods.comparePassword = function _(password: any, callback: Function) {
  bcrypt.compare(password, this.password, (err: Error | undefined, same: boolean): any => {
    if (err) return callback(err);
    if (!same) return callback(null, same);
    return callback(null, this); // this is the user object
  });
};

const Users = schoolusers.model('users', UserSchema);

export = Users;
