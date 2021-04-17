const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy; //google-oauth20').Strategy

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
    clientID: "clientID",//I have this ready just removed it to post this question
    clientSecret: "clientSecret",//I have this ready just removed it to post this question
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //Use commented section when working with a db
   //User.findOrCreate({ googleId: profile.id }, function (err, user) {
     return done(null, profile);
  // });
  }
));