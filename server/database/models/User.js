var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var UserSchema = new mongoose.Schema({
  socialName: String,
  socialUsername: String,
  curToken: String,
  socialEmail: String,
  email: String,
  firstName: String,
  lastName: String,
  age: String,
  signInSource: String,
  dateCreated: {
    type: Date,
    default: curUTCDate
  },
  lastLoginDate: {
    type: Date,
    default: curUTCDate
  },
  facebookId: String,
  googleId: String
});

module.exports.model = mongoose.model('User', UserSchema);
module.exports.schema = UserSchema;