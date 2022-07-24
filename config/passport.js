const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../models');
const { log } = require('./logger');

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: `${config.callback}/v1/auth/google/callback`
    },
    (accessToken, refreshToken, profile, cb) => cb(null, profile._json)
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: config.fb.clientId,
      clientSecret: config.fb.clientSecret,
      callbackURL: `${config.callback}/v1/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'photos', 'email'],
      scope: ["email"],
    },
    ((accessToken, refreshToken, profile, cb) => cb(null, profile._json)),
  ),
);


const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT')
};
const jwtVerify = async (payload, done) => {
  console.log("payload", payload)
  try {
    // if (payload.type !== tokenTypes.ACCESS) {
    //   throw new Error('Invalid token type');
    // }
    console.log('dxxx');
    const user = await User.findById(payload.id);
    console.log('user', user);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    console.log('7777');
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};

