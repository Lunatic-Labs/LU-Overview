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
const cookieSession = require('cookie-session');
const User = require("passport/models/user.ts");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "743003796061-jigk802a0riu4ad5olu1hnfstif59gvd.apps.googleusercontent.com",//keys.google.clientID,
    clientSecret: "G8NzByGxej5IA_K_9SCvAl8Z",//keys.google.clientSecret,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
   User.findOrCreate({ googleId: profile.id }, function (err, user) {
     return done(err, user);
   });
  }
));

///Define Routes///
app.get('/google', passport.authenticate("google", {
    scope: ['profile', 'email']
}));

app.get("/google/callback",passport.authenticate('google'));

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

app.use(cookieSession({
  // miliseconds of a day
  maxAge: 24*60*60*1000,
  keys:["123ThIs_iS_tHe_CoOkIe_KeY456"/*keys.session.cookieKey*/]
}));

app.use(passport.initialize());
app.use(passport.session());

// Source: https://dev.to/phyllis_yym/beginner-s-guide-to-google-oauth-with-passport-js-2gh4 //