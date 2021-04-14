var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({ //Add validations to prevent dirty data
  family_name: String,
  name: String,
  picture: String,
  email: String,
  given_name: String,
  id: String
}, {timestamps: true});

mongoose.model('User', UserSchema);