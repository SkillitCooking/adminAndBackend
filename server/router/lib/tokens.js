var _ = require('lodash');
var constants = require('../../util/constants');

var service = {};

//NEEDED SERVICE METHODS/FUNCTIONS
//-take in user and body token+deviceId and validate
//----> how to handle validation if most current token entry is null?
//---->does validation handle saving users? Is there a way to send a signal to the calling route to get them to go?
//-login - take new deviceid + token, store it, update previous deviceid values in the token store
//-logout - take deviceid, set its token to null, update previous deviceid values
//will have to handle conversion from old models...

module.exports = service;