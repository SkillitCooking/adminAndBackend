var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var UserSchema = new mongoose.Schema({
  socialName: String,
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
  }
});

module.exports.model = mongoose.model('User', UserSchema);
module.exports.schema = UserSchema;