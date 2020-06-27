const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../middleware/passport');
const JWT = require('jsonwebtoken');
const User = require('../models/user/User');
const Progress = require('../models/user/Progress');

const signToken = userId => {
    return JWT.sign({
        iss: 'devedu-95-secret',
        sub: userId
    }, 'devedu-95-secret', { expiresIn: '1h' })
};

userRouter.post('/register', (req, res) => {
   const { name, password, role, email } = req.body;
   User.findOne({ name }, (err, user) => {
       if (err) {
           res.status(500).json({message: {msgBody: "Error has occured", msgError: true }});
       }
       if (user) {
           res.status(409).json({message: {msgBody: "Username is already taken", msgError: true }});
       } else {
           const newUser = new User({ name, password, role, email });
           newUser.save(err => {
               if (err) {
                   res.status(500).json({message: {msgBody: "Error has occured while creating user", msgError: true }});
               } else {
                   res.status(201).json({message: {msgBody: "Account successfully created", msgError: false }});
               }
           })
       }
   })
});

userRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const token = signToken(req.user._id);
        res.cookie('devedu_token', token, { httpOnly: true, sameSite: true });
        res.status(200).json({ isAuthenticated: true, user: req.user, token: token });
    }
});

userRouter.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    // req.logout();
    res.clearCookie('access_token');
    res.json({ message: 'Successfully logged out', success: true });
});

userRouter.post('/progress', passport.authenticate('jwt', { session: false }), (req, res) => {
    const progress = new Progress(req.body);
    progress.save(err => {
        if (err) {
            res.status(500).json({ message: { msgBody: 'Error has occured while post progress data (1)', msgError: true }})
        } else {
            req.user.progress.push(progress);
            req.user.save(err => {
                if (err) {
                    res.status(500).json({ message: { msgBody: 'Error has occured while post progress data (2)', msgError: true}})
                } else {
                    res.status(200).json({ message: { msgBody: 'Successfully posted progress', msgError : false }})
                }
            })
        }
    });
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

userRouter.get('/admin', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.role === 'admin') {
        res.status(200).json({ message: { body: 'Admin logged in', error: false }});
    } else {
        res.status(403).json({ message: { body: 'You are not an admin', error: true }})
    }
});

userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ isAuthenticated: true, user: req.user });
    } else {
        res.status(400).json({ message: { body: 'You are not logged in', error: true }})
    }
});

module.exports = userRouter;
