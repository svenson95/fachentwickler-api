const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Progress = require('./Progress');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
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
    enum: ['user', 'admin', 'teacher'],
    required: true,
  },
  email: {
    type: String,
    default: '',
  },
  active: {
    type: Boolean,
    default: false,
  },
  progress: [{ type: mongoose.Schema.Types.ObjectId, ref: Progress }],
  theme: {
    type: String,
    default: 'light',
  },
});

// eslint-disable-next-line consistent-return
UserSchema.pre('save', function _(next) {
  if (!this.isModified('password')) {
    // its already hashed
    return next();
  }
  // eslint-disable-next-line consistent-return
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});

UserSchema.methods.comparePassword = function _(password, callback) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return callback(err);
    if (!isMatch) return callback(null, isMatch);
    return callback(null, this); // this is the user object
  });
};

const User = mongoose.schoolusers.model('users', UserSchema);

module.exports = User;
