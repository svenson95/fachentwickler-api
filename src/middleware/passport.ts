import { Request } from 'express';
import { CallbackError } from 'mongoose';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import passport from 'passport';
import Users from '../models/Users';

const tokenExtractor = (req: Request): string | null => {
  let token: string | null = null;
  // get token from http header Authorization
  if (req.headers.authorization) {
    token = req.headers.authorization;
  }

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
      Users.findById({ _id: payload.sub }, (error: CallbackError, user: any) => {
        if (error) return done(error, false);
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
    Users.findOne({ name }, (error: CallbackError, user: any) => {
      if (error) {
        // something went wrong with database
        return done(error);
      }
      if (!user) {
        // if no user exist
        return done(null, false);
      }
      return user.comparePassword(password, done);
    });
  }),
);
