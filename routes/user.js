const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../middleware/passport');
const JWT = require('jsonwebtoken');
const User = require('../models/user/User');
const Progress = require('../models/user/Progress');

const LF1_Post = require('../models/posts/LF1_Post');
const LF2_Post = require('../models/posts/LF2_Post');
const LF3_Post = require('../models/posts/LF3_Post');
const LF4_1_Post = require('../models/posts/LF4-1_Post');
const LF4_2_Post = require('../models/posts/LF4-2_Post');
const LF5_Post = require('../models/posts/LF5_Post');
const LF6_Post = require('../models/posts/LF6_Post');
const LF7_Post = require('../models/posts/LF7_Post');
const LF8_Post = require('../models/posts/LF8_Post');
const LF9_Post = require('../models/posts/LF9_Post');
const WP_Post = require('../models/posts/WP_Post');
const WiSo_Post = require('../models/posts/WiSo_Post');
const Englisch_Post = require('../models/posts/Englisch_Post');
const Deutsch_Post = require('../models/posts/Deutsch_Post');

const signToken = userId => {
    return JWT.sign({
        iss: 'devedu-95-secret',
        sub: userId
    }, 'devedu-95-secret', { expiresIn: '30d' })
};

userRouter.post('/register', (req, res) => {
   const { name, password, role, email } = req.body;
   User.findOne({ name }, (error, nameData) => {
       if (error) {
           res.status(500).json({message: {msgBody: "Error has occured", error: error }});
       } else if (nameData?.name === name) {
           res.status(409).json({ message: "Username is already taken", error: error });
       } else {
           User.findOne({ email }, (error, emailData) => {
               if (error) {
                   res.status(500).json({message: {msgBody: "Error has occured", error: error }});
               } else if (emailData?.email === email) {
                   res.status(409).json({ message: "E-Mail is already taken", error: error });
               } else {
                   const newUser = new User({ name, password, role, email: req.body.email });
                   newUser.save((err, newUser) => {
                       if (err) {
                           res.status(500).json({message: "Registration process failed", error: err });
                       } else {
                           res.status(201).json({message: "Account successfully created", user: newUser });
                       }
                   })
               }
           });
           // const newUser = new User({ name, password, role, email: req.body.email });
           // newUser.save(err => {
           //     if (err) {
           //         res.status(500).json({message: "Registration process failed", error: err });
           //     } else {
           //         res.status(201).json({message: "Account successfully created", msgError: false });
           //     }
           // })
       }
   });
});

userRouter.patch('/edit-user', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { name } = req.body;
    User.findOne({ name }, async (err, user) => {
        if (user) {
            user.name = req.body.name;
            user.password = req.body.password;
            user.email = req.body.email;
            user.save(err => {
                if (err) {
                    res.status(500).json({ message: "Error has occured while changing password", error: err });
                } else {
                    res.status(201).json({ message: "Password successfully changed", user: user });
                }
            });
        } else if (err) {
            res.status(500).json({message: {msgBody: "User not found | " + err, msgError: true }});
        }
    });
});

userRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const token = signToken(req.user._id);
        res.cookie('devedu_token', token, {
            maxAge: 1000 * 3600 * 24 * 30, // would expire after 30 days
            httpOnly: true, // The cookie only accessible by the web server
        });
        res.status(200).json({ isAuthenticated: true, user: req.user, token: token });
    } else {
        res.status(409).json({message: "Wrong password", error: error });
    }
});

userRouter.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    // req.logout();
    res.clearCookie('devedu_token');
    res.json({ message: 'Successfully logged out', success: true });
});

userRouter.get('/progress', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await User.findById({ _id : req.user._id }).populate('progress').exec((err, document) => {
        if (err) {
            res.status(500).json({ message : {msgBody: 'Error has occured while get progress data', msgError : true }})
        } else {
            res.status(200).json({ user: document });
        }
    })
});

userRouter.post('/add-progress', passport.authenticate('jwt', { session: false }), (req, res) => {
    const newProgress = new Progress(req.body);
    newProgress.save(error => {
        if (error) {
            res.status(500).json({ message: 'Error during post progress data (1)', error: error })
        } else {
            req.user.progress.push(newProgress);
            req.user.save(error2 => {
                if (error2) {
                    res.status(500).json({ message: 'Error during post progress data (2)', error: error2 })
                } else {
                    res.status(200).json({ message: 'Successfully posted progress', progress: newProgress })
                }
            });
        }
    });
});

// userRouter.get('/max-progress', passport.authenticate('jwt', { session: false }), async (req, res) => {
userRouter.get('/max-progress', async (req, res) => {
    const posts = [];
    try {
        posts.push({ subject: "lf-1", posts: await LF1_Post.find().map(function(user) {
            const arr = [];
            user.forEach(el => arr.push(el._id));
            return arr;
        })});
        posts.push({ subject: "lf-2", posts: await LF2_Post.find().map(function(user) {
            const arr = [];
            user.forEach(el => arr.push(el._id));
            return arr;
        })});
        posts.push({ subject: "lf-3", posts: await LF3_Post.find().map(function(user) {
            const arr = [];
            user.forEach(el => {
                arr.push(el._id);
            });
            return arr;
        })});
        posts.push({ subject: "lf-4-1", posts: await LF4_1_Post.find().map(function(user) {
            const arr = [];
            user.forEach(el => {
                arr.push(el._id);
            });
            return arr;
        })});
        posts.push({ subject: "lf-4-2", posts: await LF4_2_Post.find().map(function(user) {
            const arr = [];
            user.forEach(el => {
                arr.push(el._id);
            });
            return arr;
        })});
        posts.push({ subject: "lf-5", posts: await LF5_Post.find().map(function(user) {
            const arr = [];
            user.forEach(el => {
                arr.push(el._id);
            });
            return arr;
        })});
        posts.push({ subject: "lf-6", posts: await LF6_Post.find().map(function(user) {
            const arr = [];
            user.forEach(el => {
                arr.push(el._id);
            });
            return arr;
        })});
        posts.push({ subject: "lf-7", posts: await LF7_Post.find().map(function(user) {
            const arr = [];
            user.forEach(el => {
                arr.push(el._id);
            });
            return arr;
        })});
        posts.push({ subject: "lf-8", posts: await LF8_Post.find().map(function(user) {
            const arr = [];
            user.forEach(el => {
                arr.push(el._id);
            });
            return arr;
        })});
        posts.push({ subject: "lf-9", posts: await LF9_Post.find().map(function(user) {
            const arr = [];
            user.forEach(el => {
                arr.push(el._id);
            });
            return arr;
        })});
        posts.push({ subject: "wp", posts: await WP_Post.find().map(function(user) {
            const arr = [];
            user.forEach(el => {
                arr.push(el._id);
            });
            return arr;
        })});
        posts.push({ subject: "wiso", posts: await WiSo_Post.find().map(function(user) {
            const arr = [];
            user.forEach(el => {
                arr.push(el._id);
            });
            return arr;
        })});
        posts.push({ subject: "englisch", posts: await Englisch_Post.find().map(function(user) {
            const arr = [];
            user.forEach(el => {
                arr.push(el._id);
            });
            return arr;
        })});
        posts.push({ subject: "deutsch", posts: await Deutsch_Post.find().map(function(user) {
            const arr = [];
            user.forEach(el => {
                arr.push(el._id);
            });
            return arr;
        })});
        res.status(200).json(posts);
    } catch(error) {
        res.status(500).json({ message: 'Error has occured while get full progress data', error: error });
    }
});

userRouter.get('/admin', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.role === 'admin') {
        res.status(200).json({ message: { body: 'Admin logged in', error: false }});
    } else {
        res.status(403).json({ message: { body: 'You are not an admin', error: true }})
    }
});

userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({
            isAuthenticated: true,
            user: req.user
        });
    } else {
        res.status(401).json({ message: 'You are not logged in', res: res, req: req })
    }
});

module.exports = userRouter;
