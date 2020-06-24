const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../middleware/passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const StudyProgress = require('../models/StudyProgress');

const signToken = userId => {
    return JWT.sign({
        iss: 'devedu-95-secret',
        sub: userId
    }, 'devedu-95-secret', { expiresIn: '1h' })
}

userRouter.post('/register', (req, res) => {
   const { username, password, role } = req.body;
   User.findOne({ username }, (err, user) => {
       if (err) {
           res.status(500).json({message: {msgBody: "Error has occured", msgError: true }});
       }
       if (user) {
           res.status(400).json({message: {msgBody: "Username is already taken", msgError: true }});
       } else {
           const newUser = new User({ username, password, role });
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
        const { _id, username, role } = req.user;
        const token = signToken(_id);
        res.cookie('access_token', token, { httpOnly: true, sameSite: true });
        res.status(200).json({ isAuthenticated: true, user: { username, role }});
    }
});

userRouter.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    // req.logout();
    res.clearCookie('access_token');
    res.json({ user: { username: '', role: '' }, success: true });
});

userRouter.post('/progress', passport.authenticate('jwt', { session: false }), (req, res) => {
    const studyProgress = new StudyProgress(req.body);
    studyProgress.save(err => {
        if (err) {
            res.status(500).json({ message: { msgBody: 'Error has occured while post progress data (1)', msgError: true }})
        } else {
            req.user.studyProg.push(studyProgress);
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
    await User.findById({ _id : req.user._id }).populate('studyProgs').exec((err, document) => {
        if (err) {
            res.status(500).json({ message : {msgBody: 'Error has occured while get progress data', msgError : true }})
        } else {
            res.status(200).json({ user : document, authenticated : true });
        }
    })
});

module.exports = userRouter;
