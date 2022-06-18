const mongoose = require('mongoose');

const expireDate = () => {
  const now = new Date();
  return now.setTime(now.getTime() + 86400000);
};

const VerificationToken = mongoose.schoolusers.model(
  'verification-token',
  new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    code: { type: String, required: true },
    expire_at: { type: Date, default: expireDate() },
  }),
);

VerificationToken.schema.index({ expire_at: 1 }, { expiresAfterSeconds: 86400000 });

module.exports = VerificationToken;
