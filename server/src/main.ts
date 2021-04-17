import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { userInfo } from 'os';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	await app.listen(3000);
}


const passport = require('passport')
const express = require('express')
const app = express() 
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
//const User = require("passport/models/user.ts"); //for use with db
//require('./passport/passport-setup.ts');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy; //google-oauth20').Strategy

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize()); 
app.use(passport.session());


//Keep track of logged in status if Google is not used
passport.serializeUser((user, done) => {
  done(null, user);
});

 passport.deserializeUser((user, done) => {
   //Use commented section when working with a db
  // User.findById(id).then(user => {
     done(null, user);
  // });
});

passport.use(new GoogleStrategy({
  clientID: "743003796061-jigk802a0riu4ad5olu1hnfstif59gvd.apps.googleusercontent.com",
  clientSecret: "G8NzByGxej5IA_K_9SCvAl8Z",
  callbackURL: "http://localhost:3000/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  //Use commented section when working with a db
 //User.findOrCreate({ googleId: profile.id }, function (err, user) {
   return done(null, profile);
// });
}
));


///Routes///
app.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get("/auth/google/callback",passport.authenticate('google', { failureRedirect: '/failed' }),
  function (req, res) {
    res.redirect('/good');
  });

app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome ${req.user.email}!`));
app.get('/failed', (req, res) => res.send(`You failed to log in!`));

app.get('/logout', (req, res) => {
  req.session = null; //clear session
  req.logout(); //logout from passport
  res.redirect('/');
})
///////////////////


app.use(cookieSession({
  // miliseconds of a day
  maxAge: 24*60*60*1000,
  keys:["key1","key2"/*keys.session.cookieKey*/]
}));

bootstrap();

// Source: https://dev.to/phyllis_yym/beginner-s-guide-to-google-oauth-with-passport-js-2gh4 //