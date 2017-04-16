var mongoose = require('mongoose');
var moment = require('moment');
var request = require('request');
var db = require('../database');
var CronJob = require('cron').CronJob;
var mailingService = require('../router/lib/mailingService');
var libraryFunctions = require('../util/libraryFunctions');
var curUTCDate = require('../util/dateLib').curUTCDate;

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

function getName(user, defaultNames) {
  if(user.firstName) {
    return user.firstName;
  } else {
    var index = libraryFunctions.getRandomIndex(defaultNames.length);
    return defaultNames[index];
  }
}

function getPushMessage(name, pushMessages) {
  //string replacement
  var index = libraryFunctions.getRandomIndex(pushMessages.length);
  var pushMessage = pushMessages[index];
  pushMessage = pushMessage.replace('**NAME**', name);
  return pushMessage;
}

function getScheduleDate(user, targetTime) {
  var adjustedCurDate = moment().tz('Etc/UTC');
  var dayOfMonth = adjustedCurDate.date();
  var month = adjustedCurDate.month();
  var year = adjustedCurDate.year();
  var scheduleDate = moment().tz(user.timezoneString).date(dayOfMonth).month(month).year(year).hour(targetTime).minute(0).second(0);
  return scheduleDate.format();
}

function getPushTitle() {
  var index = libraryFunctions.getRandomIndex(constants.PUSH_NOTIFICATIONS.TITLES);
  return index;
}

function sendAppropriateDailyPushes() {
  //pull appropriate users
  User.model.find({
    timezoneString: {$or: [
      {$exists: true},
      {$type: BSON_TYPES.STRING}
    ]},
    pushToken: {$or: [
      {$exists: true},
      {$type: BSON_TYPES.STRING}
    ]}
  }, 'pushToken lastActivityDate socialName firstName haveSentInactivityNotification', function(err, users) {
    if(err) {
      //may want different error direction here, eventually
      logger.error('ERROR sendAppropriateDailyPushes User.find call', {error: err});
      mailingService.mailServerError({error: err, location: 'ERROR in sendAppropriateDailyPushes User.find call'});
      return;
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
      var name, pushMessage, scheduleDate, pushTitle;
      for (var j = inactivityQueue.length - 1; j >= 0; j--) {
        //set name
        name = getName(inactivityQueue[j], constants.PUSH_NOTIFICATIONS.DEFAULT_NAMES);
        pushMessage = getPushMessage(name, constants.PUSH_NOTIFICATIONS.INACTIVE);
        scheduleDate = getScheduleDate(inactivityQueue[j], constants.PUSH_TIMES.DAILY);
        pushTitle = getPushTitle();
        opts.body = {
          "tokens": [inactivityQueue[j].pushToken],
          "profile": "prod",
          "notification": {
            "title": pushTitle,
            "message": pushMessage
          },
          "scheduled": scheduleDate
        };
        request(opts, function(err, response, body) {  /*Any error Handling?*/   });
        users[i].save();     
      }
      for (var k = dailyQueue.length - 1; k >= 0; k--) {
        name = getName(dailyQueue[k], constants.PUSH_NOTIFICATIONS.DEFAULT_NAMES);
        pushMessage = getPushMessage(name, constants.PUSH_NOTIFICATIONS.GENERAL);
        scheduleDate = getScheduleDate(dailyQueue[k], constants.PUSH_TIMES.DAILY);
        pushTitle = getPushTitle();
        opts.body = {
          "tokens": [dailyQueue[k].pushToken],
          "profile": "prod",
          "notification": {
            "title": pushTitle,
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

function sendAppropriateSundayPushes() {
  User.model.find({
    timezoneString: {$and: [
      {$exists: true},
      {$type: constants.BSON_TYPES.STRING}
    ]},
    pushToken: {$or: [
      {$exists: true},
      {$type: constants.BSON_TYPES.STRING}
    ]}
  }, 'pushToken lastActivityDate socialName firstName haveSentInactivityNotification', function(err, users) {
    if(err) {
      logger.error('ERROR in sendAppropriateSundayPushes User.find call', {error: err});
      mailingService.mailServerError({error: err, location: 'ERROR in sendAppropriateSundayPushes User.find call'});
      return;
    }
    try {
      var opts = Object.assign({}, postOptions);
      for (var i = users.length - 1; i >= 0; i--) {
        var name = getName(users[i], constants.PUSH_NOTIFICATIONS.DEFAULT_NAMES);
        var pushMessage = getPushMessage(name, constants.PUSH_NOTIFICATIONS.SUNDAYS);
        var scheduleDate = getScheduleDate(users[i], constants.PUSH_TIMES.SUNDAY);
        var pushTitle = getPushTitle();
        opts.body = {
          "tokens": [users[i].pushToken],
          "profile": "prod",
          "notification": {
            "title": pushTitle,
            "message": pushMessage
          },
          "scheduled": scheduleDate
        };
        request(opts, function(error, response, body) {   /*Any Error Handling?*/  });
      }
    } catch (error) {
      logger.error('ERROR - exception thrown in "sendAppropriateSundayPushes"', {error: error});
      mailingService.mailServerError({error: error, location: 'EXCEPTION in "sendAppropriateSundayPushes"'});
    }
  });
}

var sundayJob = new CronJob('00 00 00 * * 0', function() {
  sendAppropriateSundayPushes();
}, null, true, 'Etc/UTC');

var dailyJob = new CronJob('00 00 00 * * 1-6', function() {
  sendAppropriateDailyPushes();
}, null, true, 'Etc/UTC');

module.exports.pushNotificationJobs = jobs;