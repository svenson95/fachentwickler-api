const VerificationToken = require('../models/user/VerificationToken');
const User = require('../models/user/User');

const tokenService = require('./token-service');
const mailService = require('./mail-service');

const verificationMailView = require('../views/verification-email');
const changeEmailView = require('../views/change-email');
const changePasswordView = require('../views/change-password');

const {
  okResponse,
  createdResponse,
  unauthorizedResponse,
  notFoundResponse,
  conflictResponse,
  internalErrorResponse,
} = require('../helper/utils.js');

function findUser(key, value, res, callback) {
  User.findOne({ [key]: value }, (error, user) => {
    if (error) {
      internalErrorResponse('Find user failed. Internal server error.', error, res);
    } else if (!user) {
      notFoundResponse('Find user failed. User not found.', res);
    } else {
      callback(user);
    }
  });
}

function saveUser(user, res, callback) {
  user.save({ _id: user._id }, (error, user) => {
    if (error) {
      internalErrorResponse('Save user failed. Internal server error.', error, res);
    } else if (!user) {
      notFoundResponse('Save user failed. User not found.', res);
    } else {
      callback(user);
    }
  });
}

module.exports = {
  findUser: findUser,
  saveUser: saveUser,

  createUser(_user, res, callback) {
    User.findOne({ name: _user.name }, (nameError, userByName) => {
      if (nameError) {
        internalErrorResponse(`Create user failed (1). Internal server error.`, nameError, res);
      } else if (userByName) {
        conflictResponse(`Create user failed. Name is already taken.`, res);
      } else {
        User.findOne({ email: _user.email }, (emailError, userByEmail) => {
          if (emailError) {
            internalErrorResponse(`Create user failed (2). Internal server error.`, emailError, res);
          } else if (userByEmail) {
            conflictResponse(`Create user failed. E-Mail is already taken.`, res);
          } else {
            const { name, password, role, email, theme } = _user;
            const newUser = new User({ name, password, role, email, theme });
            newUser.save((createError, createdUser) => {
              if (createError) {
                internalErrorResponse(`Create user failed (3). Internal server error.`, createError, res);
              } else {
                callback(createdUser);
              }
            });
          }
        });
      }
    });
  },

  forgotPassword(email, res, callback) {
    findUser('email', email, res, (userByEmail) => {
      tokenService.generateVerificationToken(userByEmail, res, (token) => {
        const mailOptions = {
          from: 'no-reply@example.com',
          to: userByEmail.email,
          subject: 'Passwort ändern',
          text: 'xxx',
          html: changePasswordView.html(userByEmail, token),
        };

        mailService.sendMail(mailOptions, res, () => {
          callback();
        });
      });
    });
  },

  editUser(user, res) {
    findUser('_id', user._id, res, (userById) => {
      if (user.newName) {
        User.findOne({ name: user.newName }, (nameError, userByName) => {
          if (nameError) {
            internalErrorResponse('Edit user name failed. Internal server error.');
          } else if (userByName) {
            conflictResponse('Edit user name failed. Name is already taken.', res);
          } else {
            userById.name = user.newName;
            saveUser(userById, res, (savedUser) => {
              okResponse('Edit user name successful.', { user: savedUser }, res);
            });
          }
        });
      }

      if (user.email) {
        User.findOne({ email: user.email }, (emailError, userByEmail) => {
          if (emailError) {
            internalErrorResponse('Edit user email failed. Internal server error.');
          } else if (userByEmail) {
            conflictResponse('Edit user email failed. Name is already taken.', res);
          } else {
            userById.name = user.newName;
            saveUser(userById, res, (savedUser) => {
              okResponse('Edit user email successful.', { user: savedUser }, res);
            });
          }
        });
      }

      if (user.password) {
        userById.password = user.password;
        saveUser(userById, res, (savedUser) => {
          okResponse('Edit user password successful.', { user: savedUser }, res);
        });
      }

      if (user.progress) {
        userById.progress = user.progress;
        saveUser(userById, res, (savedUser) => {
          okResponse('Edit user progress successful.', { user: savedUser }, res);
        });
      }

      if (user.theme) {
        userById.theme = user.theme;
        saveUser(userById, res, (savedUser) => {
          okResponse('Edit user theme successful.', { user: savedUser }, res);
        });
      }
    });
  },

  sendRegisterVerificationCode(newUser, res, callback) {
    tokenService.generateVerificationToken(newUser, res, (token) => {
      const mailOptions = {
        from: 'no-reply@example.com',
        to: newUser.email,
        subject: 'Ihre Anmeldung auf fachentwickler',
        text: 'xxx',
        html: verificationMailView.html(newUser, token),
      };

      mailService.sendMail(mailOptions, res, () => {
        callback();
      });
    });
  },

  sendChangeEmailVerificationCode(newUser, res) {
    tokenService.generateVerificationToken(newUser, res, (token) => {
      const mailOptions = {
        from: 'no-reply@example.com',
        to: newUser.email,
        subject: 'E-Mail Adresse ändern',
        text: 'xxx',
        html: changeEmailView.html(newUser, token),
      };

      mailService.sendMail(mailOptions, res, () => {
        tokenService.signToken(newUser);
        createdResponse('Verification code successfully created & sent', null, res);
      });
    });
  },

  verifyUser(code, email, res, newEmail = null) {
    VerificationToken.findOne({ code: code }, (error, token) => {
      if (!token) {
        unauthorizedResponse('Verify user failed. Matching verification code not found.', res);
      } else {
        findUser('_id', token._userId, res, async (userById) => {
          if (userById.active !== true) {
            userById.active = true;
            saveUser(userById, res, (savedUser) => {
              tokenService.deleteToken('code', token.code, res, () => {
                okResponse('Verify user successful.', { user: savedUser }, res);
              });
            });
          } else if (userById.active === true && newEmail !== null) {
            userById.email = newEmail;
            saveUser(userById, res, (savedUser) => {
              tokenService.deleteToken('code', token.code, res, () => {
                okResponse('Verify new user email successful.', { user: savedUser }, res);
              });
            });
          } else if (userById.active === true) {
            conflictResponse('Verify user failed. User is already verified.', res);
          }
        });
      }
    });
  },

  changePassword(code, newPassword, res) {
    VerificationToken.findOne({ code: code }, (error, token) => {
      if (error) {
        internalErrorResponse('Change user password failed. Internal server error.', error, res);
      } else if (!token) {
        unauthorizedResponse('Change user password failed. Matching verification code not found.', res);
      } else {
        findUser('_id', token._userId, res, (userById) => {
          userById.password = newPassword;
          saveUser(userById, res, (savedUser) => {
            tokenService.deleteToken('code', token.code, res, () => {
              okResponse('Change user password successful.', { user: savedUser }, res);
            });
          });
        });
      }
    });
  },
};
