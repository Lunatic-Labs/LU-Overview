import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { userInfo } from 'os';
import { AppModule } from './app.module';


async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	await app.listen(3000);
}
bootstrap();

const passport = require('passport')
const express = require('express')
const app = express()
const keys = require('./keys.js');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

//This is the template // Not currently functional
passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "/auth/google/callback"
  },
  // Use this when working with a database
  //function(accessToken, refreshToken, profile, cb) {
  //  User.findOrCreate({ googleId: profile.id }, function (err, user) {
  //    return cb(err, user);
  //  });
  //}
));

///Define Routes///
app.get('/auth/google', passport.authenticate("google", {
    scope: ['profile', 'email']
}));

app.get("/auth/google/callback",passport.authenticate('google'));

///////////////////

//Keep track of logged in status if Google is not used
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// passport.deserializeUser((id, done) => {
//   User.findById(id).then(user => {
//     done(null, user);
//   });
// });

// Source: https://dev.to/phyllis_yym/beginner-s-guide-to-google-oauth-with-passport-js-2gh4 //