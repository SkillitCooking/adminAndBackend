var mongoose = require('mongoose');
var moment = require('moment');
var request = require('request');
var db = require('../database');
var CronJob = require('cron').CronJob;

var logger = require('../util/logger').serverLogger;
var constants = require('../util/constants');
var timezoneLib = require('../util/timezones');

var User = db.users;

var jobs = [];

var postOptions = {
  method: 'POST',
  url: 'https://api.ionic.io/push/notifications',
  headers: {
    'Authorization': 'Bearer' + constants.IONIC_API_TOKEN,
    'Content-Type': 'application/json'
  },
  json: true
};

function notificationCallback(error, response, body) {
  if(!error && response.statusCode == 200) {
    var info = JSON.parse(body);
  }
}

function sendAppropriateDailyPushes(timezone) {
  //pull appropriate users
  User.model.find({
    timezoneString: timezone,
    pushToken: {$exists: true}
  }, 'pushToken lastActivityDate socialName firstName', function(err, users) {
    if(err) {
      //may want different error direction here, eventually
      logger.error('ERROR sendAppropriateDailyPushes', {error: err});
    }
    try {
      var inactivityQueue, dailyQueue = [];
      for (var i = users.length - 1; i >= 0; i--) {
        if(moment().subtract(14, 'days').isSameOrAfter(users[i].lastActivityDate, 'day')) {
          //then inactivity
          users[i].haveSentInactivityNotification = true;
          inactivityQueue.push(users[i]);
        } else {
          //then no inactivity
          
          dailyQueue.push(users[i]);
        }
      }
      
    } catch (error) {
      logger.error('ERROR - exception thrown in "sendAppropriateDailyPushes"', {error: error});
    }
  });
}

function sendAppropriateSundayPushes(timezone) {

}

var PacificDailyJob = new CronJob('00 00 18 * * 1-6', function() {
  sendAppropriateDailyPushes('America/Los_Angeles');
}, null, true, 'America/Los_Angeles');

jobs.push(PacificDailyJob);

var EasternDailyJob = new CronJob('00 00 18 * * 1-6', function() {
  sendAppropriateDailyPushes('America/New_York');
}, null, true, 'America/New_York');

jobs.push(EasternDailyJob);

var AtlanticDailyJob = new CronJob('00 00 18 * * 1-6', function() {
  sendAppropriateDailyPushes('America/Puerto_Rico');
}, null, true, 'America/Puerto_Rico');

jobs.push(AtlanticDailyJob);

var MountainDailyJob = new CronJob('00 00 18 * * 1-6', function() {
  sendAppropriateDailyPushes('America/Denver');
}, null, true, 'America/Denver');

jobs.push(MountainDailyJob);

var MSTDailyJob = new CronJob('00 00 18 * * 1-6', function() {
  sendAppropriateDailyPushes('America/Phoenix');
}, null, true, 'America/Phoenix');

jobs.push(MSTDailyJob);

var AlaskaDailyJob = new CronJob('00 00 18 * * 1-6', function() {
  sendAppropriateDailyPushes('America/Anchorage');
}, null, true, 'America/Anchorage');

jobs.push(AlaskaDailyJob);

var HawaiiDailyJob = new CronJob('00 00 18 * * 1-6', function() {
  sendAppropriateDailyPushes('Pacific/Honolulu');
}, null, true, 'Pacific/Honolulu');

jobs.push(HawaiiDailyJob);

//sunday jobs

var PacificSundayJob = new CronJob('00 00 12 * * 0', function() {
  sendAppropriateSundayPushes('America/Los_Angeles');
}, null, true, 'America/Los_Angeles');

jobs.push(PacificSundayJob);

var EasternSundayJob = new CronJob('00 00 12 * * 0', function() {
  sendAppropriateSundayPushes('America/New_York');
}, null, true, 'America/New_York');

jobs.push(EasternSundayJob);

var AtlanticSundayJob = new CronJob('00 00 12 * * 0', function() {
  sendAppropriateSundayPushes('America/Puerto_Rico');
}, null, true, 'America/Puerto_Rico');

jobs.push(AtlanticSundayJob);

var MountainSundayJob = new CronJob('00 00 12 * * 0', function() {
  sendAppropriateSundayPushes('America/Denver');
}, null, true, 'America/Denver');

jobs.push(MountainSundayJob);

var MSTSundayJob = new CronJob('00 00 12 * * 0', function() {
  sendAppropriateSundayPushes('America/Phoenix');
}, null, true, 'America/Phoenix');

jobs.push(MSTSundayJob);

var AlaskaSundayJob = new CronJob('00 00 12 * * 0', function() {
  sendAppropriateSundayPushes('America/Anchorage');
}, null, true, 'America/Anchorage');

jobs.push(AlaskaSundayJob);

var HawaiiSundayJob = new CronJob('00 00 12 * * 0', function() {
  sendAppropriateSundayPushes('Pacific/Honolulu');
}, null, true, 'Pacific/Honolulu');

jobs.push(HawaiiSundayJob);

module.exports.pushNotificationJobs = jobs;