const JWT = require('jsonwebtoken');
const crypto = require('crypto');

const VerificationToken = require('../models/user/VerificationToken');

const { internalErrorResponse } = require('../helper/utils.js');

module.exports = {
  generateVerificationToken: function (user, res, callback) {
    const generatedCode = () => {
      let code = '';
      do {
        code += crypto.randomBytes(3).readUIntBE(0, 3);
      } while (code.length < 6);
      return code.slice(0, 6);
    };

    const verificationToken = new VerificationToken({ _userId: user._id, code: generatedCode() });
    verificationToken.save(function (saveError, savedToken) {
      if (saveError) {
        internalErrorResponse('Save generated verification code failed.', saveError, res);
      } else {
        callback(savedToken);
      }
    });
  },

  signToken: function (user) {
    return JWT.sign(
      {
        sub: user._id,
        role: user.role,
        iss: 'http://159.65.105.150',
        directory: __dirname,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
    );
  },

  deleteToken: async function (key, value, res, callback) {
    await VerificationToken.remove({ [key]: value }, (removeError, removedToken) => {
      if (removeError) {
        internalErrorResponse('Delete verification code failed. Internal server error.', removeError, res);
      } else {
        callback();
      }
    });
  },
};
