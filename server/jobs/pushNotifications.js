var mongoose = require('mongoose');
var moment = require('moment');
var request = require('request');
var db = require('../database');
var mailingService = require('../lib/mailingService');

var logger = require('../util/logger').serverLogger;
var constants = require('../util/constants');
var timezoneLib = require('../util/timezones');
var CronJob = require('cron').CronJob;

var User = db.users;

var jobs = [];

var postOptions = {
  method: 'POST',
  url: 'https://api.ionic.io/push/notifications',
  headers: {
    'Authorization': 'Bearer ' + constants.IONIC_API_TOKEN,
    'Content-Type': 'application/json'
  },
  json: true
};

function notificationCallback(error, response, body) {
  if(!error && response.statusCode == 200) {
    var info = JSON.parse(body);
  }
}

function sendAppropriateDailyPushes() {
  //pull appropriate users
  User.model.find({
    timezoneString: {$exists: true},
    pushToken: {$exists: true}
  }, 'pushToken lastActivityDate socialName firstName haveSentInactivityNotification', function(err, users) {
    if(err) {
      //may want different error direction here, eventually
      logger.error('ERROR sendAppropriateDailyPushes', {error: err});
    }
    try {
      var inactivityQueue, dailyQueue = [];
      for (var i = users.length - 1; i >= 0; i--) {
        if(moment().subtract(14, 'days').isSameOrAfter(users[i].lastActivityDate, 'day') &&
          !users[i].haveSentInactivityNotification) {
          //then inactivity
          users[i].haveSentInactivityNotification = true;
          inactivityQueue.push(users[i]);
        } else {
          //then no inactivity
          dailyQueue.push(users[i]);
        }
      }
      var opts = Object.assign({}, postOptions);
      var name, pushMessage, scheduleDate;
      for (var j = inactivityQueue.length - 1; j >= 0; j--) {
        //set name
        name = getName(inactivityQueue[j], 'you');
        pushMessage = getPushMessage(name, constants.PUSH_NOTIFICATIONS.INACTIVE);
        scheduleDate = getScheduleDate(inactivityQueue[j]);
        opts.body = {
          "tokens": [inactivityQueue[j].pushToken],
          "profile": "prod",
          "notification": {
            "title": "",
            "message": pushMessage
          },
          "scheduled": scheduleDate
        };
        request(opts, function(err, response, body) {  /*Any error Handling?*/   });
      }
      for (var k = dailyQueue.length - 1; k >= 0; k--) {
        name = getName(dailyQueue[k], 'boss');
        pushMessage = getPushMessage(name, constants.PUSH_NOTIFICATIONS.GENERAL);
        scheduleDate = getScheduleDate(dailyQueue[k]);
        opts.body = {
          "tokens": [dailyQueue[k].pushToken],
          "profile": "prod",
          "notification": {
            "title": "",
            "message": pushMessage
          },
          "scheduled": scheduleDate
        };
        request(opts, function(err, response, body) {  /*Any error handling?*/  });
      }
    } catch (error) {
      logger.error('ERROR - exception thrown in "sendAppropriateDailyPushes"', {error: error});
      mailingService.mailServerError({error: error, location: 'EXCEPTION in "sendAppropriateDailyPushes"'});
    }
  });
}

function sendAppropriateSundayPushes(timezone) {

}

var PacificDailyJob = new CronJob('00 00 00 * * 1-6', function() {
  //sendAppropriateDailyPushes();
  postOptions.body = {
    "tokens": ["cJXJhBwUYLw:APA91bES5Tt28SCLp-gvdAtiMBSH96eurTl3nq3DuvbsnJWT384LrJeKp3psWVhxlCwizUDd6ONFRtZaf83DZ2UcNMPBlp9u_EiVT2Pjj_ICYufjGBxkrTriiJ9_70jSoLBXCrzkhi_t"],
    "profile": "dev",
    "notification": {
      "message": "Hey Hi"
    }
  };
  request(postOptions, function(err, response, body) {
    console.log('error', err);
    //console.log('response', response);
    console.log('body', body);
    console.log('data', body.data);
  });
}, null, true, 'Etc/UTC');

module.exports.pushNotificationJobs = jobs;