const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
require('../middleware/passport');

const Progress = require('../models/user/Progress');
const tokenService = require('../services/token-service');
const userService = require('../services/user-service');

const {
  okResponse,
  createdResponse,
  unauthorizedResponse,
  conflictResponse,
  internalErrorResponse,
} = require('../helper/utils.js');

userRouter.post('/register', (req, res) => {
  userService.createUser(req.body, res, (createdUser) => {
    userService.sendRegisterVerificationCode(createdUser, res, () => {
      createdResponse('Create user successful.', null, res);
    });
  });
});

userRouter.post('/forgot-password', (req, res) => {
  userService.forgotPassword(req.body.email, res, () => {
    createdResponse('Verification code sent.', null, res);
  });
});

userRouter.get('/confirmation/:email/:code', (req, res) => {
  const { code, email } = req.params;

  userService.verifyUser(code, email, res);
});

userRouter.get('/confirmation/:email/:code/:newEmail', (req, res) => {
  const { code, email, newEmail } = req.params;
  userService.verifyUser(code, email, res, newEmail);
});

userRouter.post('/resend-verification-code', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { email } = req.body;

  userService.findUser('email', email, res, (userByEmail) => {
    if (userByEmail.active) {
      conflictResponse('Resend verification code failed. User is already verified.', res);
    } else {
      tokenService.deleteToken('_userId', userByEmail._id, res, () => {
        userService.sendRegisterVerificationCode(userByEmail, res, () => {
          createdResponse('Verification code successfully resent. Previous verification code deleted.', null, res);
        });
      });
    }
  });
});

userRouter.post('/change-password', (req, res) => {
  const { code, newPassword } = req.body;
  userService.changePassword(code, newPassword, res);
});

userRouter.patch('/edit-user', passport.authenticate('jwt', { session: false }, null), (req, res) => {
  const user = req.body;
  if (req.isAuthenticated()) {
    userService.editUser(user, res);
  } else {
    unauthorizedResponse('Edit user failed. Not authorized.', res);
  }
});

userRouter.post('/login', passport.authenticate('local', { session: false }, null), (req, res) => {
  if (req.isAuthenticated()) {
    const token = tokenService.signToken(req.user);
    okResponse('Logged in successfully.', { user: req.user, token }, res);
  } else {
    unauthorizedResponse('Invalid username or password.', res);
  }
});

userRouter.get('/logout', passport.authenticate('jwt', { session: false }, null), (req, res) => {
  okResponse('Successfully logged out', null, res);
});

// userRouter.get('/progress', passport.authenticate('jwt', { session: false }), (req, res) => {
//   User.findById({ _id: req.user._id })
//     .populate('progress')
//     .exec((error, user) => {
//       if (error) {
//         internalErrorResponse('Find user with populated progress failed.', error, res);
//       } else {
//         okResponse('Find user progress successful.', user, res);
//       }
//     });
// });

userRouter.post('/add-progress', passport.authenticate('jwt', { session: false }, null), (req, res) => {
  userService.findUser('_id', req.body.userId, res, (user) => {
    if (user.progress.includes(req.body.postId)) {
      conflictResponse('Lesson is already marked as read.', res);
    } else {
      const newProgress = new Progress(req.body);
      newProgress.save((createError, createProgress) => {
        if (createError) {
          internalErrorResponse('Save new progress failed.', createError, res);
        } else {
          req.user.progress.push(req.body.postId);
          req.user.save((saveError, saveUser) => {
            if (saveError) {
              internalErrorResponse('Save edited user progress failed.', saveError, res);
            } else {
              okResponse('Added user progress successfully.', { progress: createProgress, user: saveUser }, res);
            }
          });
        }
      });
    }
  });
});

userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.isAuthenticated()) {
    const token = tokenService.signToken(req.user);
    okResponse('Authenticated.', { user: req.user, token }, res);
  } else {
    unauthorizedResponse('Not Authorized.', res);
  }
});

module.exports = userRouter;
