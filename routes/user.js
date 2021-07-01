const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../middleware/passport');

const Progress = require('../models/user/Progress');
const VerificationToken = require('../models/user/VerificationToken');

const tokenService = require('../services/token-service');
const userService = require('../services/user-service');

userRouter.post('/register', (req, res) => {
   userService.createUser(req.body, res);
});

userRouter.get('/confirmation/:email/:code', (req, res) => {
    const { code, email } = req.params;

    userService.confirmUser(code, email, res);
});

userRouter.get('/confirmation/:email/:code/:newEmail', (req, res) => {
    const { code, email, newEmail } = req.params;

    userService.confirmUser(code, email, res, newEmail);
});

userRouter.post('/resend-verification-link', (req, res) => {
    const { email } = req.body;

    userService.findUser('email', email, res, async (userByEmail) => {
        if (userByEmail.active) {
            return res.status(200).send({
                success: false,
                code: "UserVerifiedException",
                message: 'User is already verified.'
            });
        }

        await VerificationToken.remove({ _userId: user._id }, (err, token) => {
            if (err) {
                return res.status(400).send({
                    success: false,
                    code: "DeleteVerificationTokenException",
                    message: 'Delete exisiting user tokens failed.',
                    error: err
                });
            }
        });
        userService.sendVerificationEmail(userByEmail, res);
    });
});

userRouter.patch('/edit-user', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.body;
        userService.editUser(user, res);
    } else {
        res.status(401).json({
            isAuthenticated: false,
            code: "NotAuthenticatedException",
            message: "Not authenticated, token may have expired.",
            response: res,
            request: req
        });
    }
});

userRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const token = tokenService.signToken(req.user._id);
        res.status(200).json({
            isAuthenticated: true,
            message: "Valid user data",
            user: req.user,
            token: token
        });
    } else {
        res.status(401).json({
            isAuthenticated: false,
            message: "Wrong password",
            response: res,
            request: req
        });
    }
});

userRouter.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        success: true,
        message: 'Successfully logged out'
    });
});

// userRouter.get('/progress', passport.authenticate('jwt', { session: false }), async (req, res) => {
//     await User.findById({ _id : req.user._id }).populate('progress').exec((err, user) => {
//         if (err) {
//             res.status(500).json({
//                 success: false,
//                 message: 'Get progress data failed'
//             })
//         } else {
//             res.status(200).json({
//                 success: true,
//                 message: 'User progress';
//                 user: user
//             });
//         }
//     })
// });

userRouter.post('/add-progress', passport.authenticate('jwt', { session: false }), (req, res) => {
    const newProgress = new Progress(req.body);
    newProgress.save(error => {
        if (error) {
            res.status(500).json({
                success: false,
                code: "AddUserProgressException",
                message: 'Add progress data failed',
                error: error
            })
        } else {
            req.user.progress.push(req.body.postId);
            req.user.save(error2 => {
                if (error2) {
                    res.status(500).json({
                        success: false,
                        code: "SaveUserProgressException",
                        message: 'Add progress data failed - save edited user (progress array)',
                        error: error2
                    })
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Successfully added progress',
                        progress: newProgress,
                        user: req.user
                    })
                }
            });
        }
    });
});

userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.isAuthenticated()) {
        const token = tokenService.signToken(req.user._id);
        res.status(200).json({
            isAuthenticated: true,
            message: 'User authenticated',
            user: req.user,
            token: token
        });
    } else {
        res.status(401).json({
            isAuthenticated: false,
            message: 'You are not logged in',
            response: res,
            request: req
        })
    }
});

module.exports = userRouter;
