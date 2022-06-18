const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');
const User = require('../models/user/User');

const tokenExtractor = (req) => {
  let token = null;
  // get token from http header Authorization
  token = req.headers.authorization;

  // get token from request cookies
  // if (req && req.cookies) {
  //     token = req.cookies['fachentwickler_auth'];
  // }
  return token;
};

// // strategy using jwt token
passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: tokenExtractor,
      secretOrKey: process.env.JWT_SECRET,
    },
    (payload, done) => {
      User.findById({ _id: payload.sub }, (err, user) => {
        if (err) return done(err, false);
        if (user) return done(null, user);
        return done(null, false);
      });
    },
  ),
);

// strategy using username and password
passport.use(
  'local',
  new LocalStrategy((name, password, done) => {
    User.findOne({ name }, (err, user) => {
      if (err) {
        // something went wrong with database
        return done(err);
      }
      if (!user) {
        // if no user exist
        return done(null, false);
      }
      return user.comparePassword(password, done); // check if password is correct
    });
  }),
);
