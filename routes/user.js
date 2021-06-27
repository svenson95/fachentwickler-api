const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const JWT = require('jsonwebtoken');

const User = require('../models/user/User');
const Progress = require('../models/user/Progress');
const VerificationToken = require('../models/user/VerificationToken');

const tokenService = require('../services/token-service');
const mailService = require('../services/mail-service');

const signToken = userId => {
    return JWT.sign({
        iss: 'fachentwickler-95-secret',
        sub: userId
    }, 'devedu-95-secret', { expiresIn: '30d' })
};

function sendVerificationEmail(newUser, req, res) {
    tokenService.generateVerificationToken(newUser, res, (token) => {
        const mailOptions = {
            from: 'no-reply@example.com',
            to: newUser.email,
            subject: 'Ihre Anmeldung auf fachentwickler',
            text: 'Hallo ' + req.body.name + ',\n\n' + 'Bitte verifiziere deine E-Mail Adresse um die Registrierung abzuschließen. \nhttp:\/\/' + req.headers.host + '\/user/confirmation\/' + newUser.email + '\/' + token.code + '\n\nfachentwickler\nhttp:\\/\\/\' + req.headers.host'
        };

        mailService.sendMail(mailOptions, res,(response) => {
            return res.status(201).json({
                success: true,
                message: 'A verification link has been sent to ' + newUser.email + '. It will be expire after 24 hours.',
                user: newUser,
                response: response
            });
        });
    });
}

userRouter.post('/register', (req, res) => {
   const { password, role, email, theme } = req.body;
   const name = req.body.name.toLowerCase();

    // check already existing user name
   User.findOne({ name }, (error, userByName) => {
       if (error) {
           return res.status(500).json({
               success: false,
               message: "Try to find user by name failed",
               error: error
           });
       } else if (userByName) {
           return res.status(409).json({
               success: false,
               message: "Username is already taken",
               error: error
           });
       }

       // check already existing user e-mail
       User.findOne({ email }, (error, userByEmail) => {
           if (error) {
               return res.status(500).json({
                   success: false,
                   message: "Try to find user by e-mail failed",
                   error: error
               });
           } else if (userByEmail) {
               return res.status(409).json({
                   success: false,
                   message: "E-Mail is already taken",
                   error: error
               });
           }

           // create new user if not already existing
           const newUser = new User({ name, password, role, email, theme });
           newUser.save((err, newUser) => {
               if (err) {
                   return res.status(500).json({
                       success: false,
                       message: "Register new user failed.",
                       error: err
                   });
               }

               // create jwt token for created user
               const token = signToken(newUser._id);
               res.cookie('fachentwickler_auth', token, {
                   maxAge: 1000 * 3600 * 24 * 30, // would expire after 30 days
                   // httpOnly: true, // The cookie only accessible by the web server
               });

               sendVerificationEmail(newUser, req, res);
           });
       });
   });
});

userRouter.get('/confirmation/:email/:code', (req, res) => {
    const { code, email } = req.params;

    // get verification token
    VerificationToken.findOne({ code: code }, function (err, code) {
        if (!code) {
            return res.status(400).send({
                success: false,
                message: 'Verification link is invalid. Token may have expired.'
            });
        }

        // get user of verification token
        User.findOne({ _id: code._userId, email: email }, function (err, user) {
            if (!user) {
                return res.status(401).send({
                    success: false,
                    message: 'User not found.',
                    error: err
                });
            } else if (user.active === true) {
                return res.status(200).send({
                    success: false,
                    message: 'User is already verified.',
                    error: err
                });
            }

            user.active = true;
            user.save(async (err, user) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: 'Set user active attribute to true failed.',
                        error: err
                    });
                }

                await tokenService.deleteToken(req.params.code, res, (response) => {
                    return res.status(200).send({
                        success: true,
                        message: 'User verified successfully. Verification token deleted.',
                        response: response
                    });
                });
            });
        });
    });
});

userRouter.post('/resend-verification-link', (req, res) => {
    const { email } = req.body;

    // get user to verify
    User.findOne({ email: email }, function (err, user) {
        if (!user) {
            return res.status(400).send({
                success: false,
                message: 'User with E-Mail ' + email + ' not found.',
                error: err
            });
        } else if (user.active) {
            return res.status(200).send({
                success: false,
                message: 'User is already verified.',
                user: user,
                error: err
            });
        } else {
            sendVerificationEmail(user, req, res);
        }
    });
});

userRouter.patch('/edit-user', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const name = req.body.name;
    User.findOne({ name }, async (err, user) => {
        if (user) {

            if (req.body.email) {
                user.email = req.body.email;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            if (req.body.newName) {
                user.name = req.body.newName;
            }

            if (req.body.theme) {
                user.theme = req.body.theme;
            }

            if (req.body.progress) {
                user.progress = req.body.progress;
            }

            const newName = req.body.newName;
            User.findOne({ "name": newName }, async (err2, user2) => {
                if (user2) {
                    return res.status(409).json({
                        success: false,
                        message: "Username is already taken"
                    });
                } else if (err2) {
                    return res.status(500).json({
                        success: false,
                        message: "Error has occured while changing user (4)",
                        error: err2
                    });
                } else {
                    const newEmail = req.body.email;
                    User.findOne({ "email": newEmail}, async (err3, user3) => {
                        if (user3) {
                            return res.status(409).json({
                                success: false,
                                message: "E-Mail is already taken"
                            });
                        } else if (err3) {
                            return res.status(500).json({
                                success: false,
                                message: "Error has occured while changing user (2)",
                                error: err3
                            });
                        } else {
                            user.save(err4 => {
                                if (err4) {
                                    res.status(500).json({
                                        success: false,
                                        message: "Error has occured while changing user (5)",
                                        error: err4
                                    });
                                } else {
                                    res.status(201).json({
                                        success: true,
                                        message: "User successfully changed",
                                        user: user
                                    });
                                }
                            });
                        }
                    });
                }
            });

        } else if (err) {
            res.status(500).json({
                success: false,
                message: "User not found",
                error: err
            });
        }
    });
});

userRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const token = signToken(req.user._id);
        res.cookie('fachentwickler_auth', token, {
            maxAge: 1000 * 3600 * 24 * 30, // would expire after 30 days
            // httpOnly: true, // The cookie only accessible by the web server
        });
        res.status(200).json({
            isAuthenticated: true,
            message: "Valid user data",
            user: req.user,
            token: token
        });
    } else {
        res.status(409).json({
            isAuthenticated: false,
            message: "Wrong password",
            response: res,
            request: req
        });
    }
});

userRouter.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.clearCookie('fachentwickler_auth');
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
                message: 'Add progress data failed',
                error: error
            })
        } else {
            req.user.progress.push(req.body.postId);
            req.user.save(error2 => {
                if (error2) {
                    res.status(500).json({
                        success: false,
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
        const token = signToken(req.user._id);
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
