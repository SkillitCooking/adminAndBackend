var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var DietaryPreference = require('./DietaryPreference');

var UserSchema = new mongoose.Schema({
  socialName: String,
  socialUsername: String,
  curToken: String,
  deviceTokenDict: mongoose.Schema.Types.Mixed,
  deviceUUID: String,
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
  googleId: String,
  dietaryPreferences: [DietaryPreference.schema],
  timezoneString: String,
  actualTimezoneString: String,
  pushToken: String,
  lastActivityDate: Date,
  haveSentInactivityNotification: Boolean
});

module.exports.model = mongoose.model('User', UserSchema);
module.exports.schema = UserSchema;