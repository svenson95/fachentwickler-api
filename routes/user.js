const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../middleware/passport');

const Progress = require('../models/user/Progress');
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

        await tokenService.deleteToken('_userId', user._id, res, (response) => {
            userService.sendVerificationEmail(userByEmail, res);
        });
    });
});

userRouter.patch('/edit-user', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.body;
        userService.editUser(user, res);
    } else {
        res.status(401).json({
            isAuthenticated: false,
            code: "UnauthorizedException",
            message: "Not authenticated, token may have expired.",
            response: res,
            request: req
        });
    }
});

userRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const token = tokenService.signToken(req.user);
        res.status(200).json({
            isAuthenticated: true,
            message: "Login successful.",
            user: req.user,
            token: token
        });
    } else {
        res.status(401).json({
            isAuthenticated: false,
            code: "InvalidCredentialsException",
            message: "Invalid username or password.",
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
    userService.findUser('_id', req.body.userId, res, (user) => {

        if (user.progress.contains(req.body.postId)) {
            return res.status(409).json({
                success: false,
                code: "AlreadyReadException",
                message: 'Lesson is already marked as read.',
                progress: user.progress
            })
        }

        const newProgress = new Progress(req.body);
        newProgress.save(progressError => {
            if (progressError) {
                res.status(500).json({
                    success: false,
                    code: "SaveNewProgressException",
                    message: 'Save new progress failed.',
                    error: progressError
                })
            } else {
                req.user.progress.push(req.body.postId);
                req.user.save(userError => {
                    if (userError) {
                        res.status(500).json({
                            success: false,
                            code: "EditUserProgressException",
                            message: 'Save edited user progress failed.',
                            error: userError
                        })
                    } else {
                        res.status(200).json({
                            success: true,
                            message: 'Added user progress successfully.',
                            progress: newProgress,
                            user: req.user
                        })
                    }
                });
            }
        });
    });
});

userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.isAuthenticated()) {
        const token = tokenService.signToken(req.user);
        res.status(200).json({
            isAuthenticated: true,
            message: 'Authentication successful.',
            user: req.user,
            token: token
        });
    } else {
        res.status(401).json({
            isAuthenticated: false,
            code: 'UnauthorizedException',
            message: 'Logout due to authentication fail.',
            response: res,
            request: req
        })
    }
});

module.exports = userRouter;
