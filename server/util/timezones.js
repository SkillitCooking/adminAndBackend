var moment = require('moment');
var constants = require('./constants');

var service = {};

//what zones to include here?
//Eventually get better conversion/general system
//Could probably work in some version of regex 
//interpretation
var timezoneMap = {
  'America/Alaska': 'America/Alaska',
  'America/Anchorage': 'America/Anchorage',
  'America/Boise': 'America/Denver',
  'America/Cancun': 'America/New_York',
  'America/Chihuahua': 'America/Denver',
  'America/Creston': 'America/Denver',
  'America/Denver': 'America/Denver',
  'America/Detroit': 'America/New_York',
  'America/Edmonton': 'America/Denver',
  'America/Halifax': 'America/Puerto_Rico',
  'America/Indiana/Indianapolis': 'America/New_York',
  'America/Indianapolis': 'America/New_York',
  'America/Juneau': 'America/Alaska',
  'America/Los_Angeles': 'America/Los_Angeles',
  'America/Mexico_City': 'America/Chicago',
  'America/Monterrey': 'America/Chicago',
  'America/Montreal': 'America/New_York',
  'America/New_York': 'America/New_York',
  'America/Phoenix': 'America/Phoenix',
  'America/Puerto_Rico': 'America/Puerto_Rico',
  'America/Regina': 'America/Chicago',
  'America/Tijuana': 'America/Los_Angeles',
  'America/Toronto': 'America/New_York',
  'America/Vancouver': 'America/Los_Angeles',
  'Pacific/Honolulu': 'Pacific/Honolulu'
};

service.convertTimezone = function(timezone) {
  var conversion = timezoneMap[timezone];
  if(typeof conversion === 'undefined') {
    conversion = constants.TIMEZONES.DEFAULT;
  }
  return conversion;
};

module.exports = service;