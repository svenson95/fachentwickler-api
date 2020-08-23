const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../middleware/passport');
const JWT = require('jsonwebtoken');
const User = require('../models/user/User');
const Progress = require('../models/user/Progress');
const Posts = require('../models/posts/Posts');
const Quizzes = require('../models/quiz/Quiz');

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
       } else if (nameData) {
           res.status(409).json({ message: "Username is already taken", error: error });
       } else {
           User.findOne({ email }, (error, emailData) => {
               if (error) {
                   res.status(500).json({message: {msgBody: "Error has occured", error: error }});
               } else if (emailData) {
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
            res.status(500).json({ message : {msgBody: 'Get progress data failed', msgError : true }})
        } else {
            res.status(200).json({ user: document });
        }
    })
});

userRouter.post('/add-progress', passport.authenticate('jwt', { session: false }), (req, res) => {
    const newProgress = new Progress(req.body);
    newProgress.save(error => {
        if (error) {
            res.status(500).json({ message: 'Add progress data failed - save new post', error: error })
        } else {
            req.user.progress.push(req.body.unitId);
            req.user.save(error2 => {
                if (error2) {
                    res.status(500).json({ message: 'Add progress data failed - save edited user (progress array)', error: error2 })
                } else {
                    res.status(200).json({ message: 'Successfully added progress', progress: newProgress })
                }
            });
        }
    });
});

// userRouter.get('/max-progress', passport.authenticate('jwt', { session: false }), async (req, res) => {
userRouter.get('/max-progress', async (req, res) => {
    try {
        const arr = [];
        await Posts.find().map(function(user) {
            user.forEach(el => arr.push(el._id));
        });
        await Quizzes.find().map(function(quiz) {
            quiz.forEach(el => arr.push(el._id));
        });
        res.status(200).json(arr);
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
