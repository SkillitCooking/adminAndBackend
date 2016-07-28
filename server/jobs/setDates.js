var moment = require('moment');
var CronJob = require('cron').CronJob;
var localStorage = require('../util/localStorage').localStorage;
var loggers = require('../util/logger');
var winston = require('winston');

function reconfigureLoggers(dailyLogFileName) {
  loggers.clientLogger.configure({
    transports: [
      new (winston.transports.File)({
        name: 'client-error-logs',
        filename: 'logs/client/' + dailyLogFileName,
        level: 'error'
      })
    ]
  });
  loggers.serverLogger.configure({
    transports: [
      new (winston.transports.File)({
        name: 'api-logs',
        filename: 'logs/api/callLogs/' + dailyLogFileName,
        level: 'info'
      }),
      new (winston.transports.File)({
        name: 'server-error-logs',
        filename: 'logs/api/errors/errors.log',
        level: 'error'
      })
    ]
  });
}

function setFormattedDate() {
  var formattedDate = moment().format('M+D+YYYY');
  localStorage.set('currentDateString', formattedDate);
  reconfigureLoggers(formattedDate + '.log');
}

//run every 24 hours at midnight
var job = new CronJob('00 00 00 * * *', function() {
  setFormattedDate();
}, null, true, 'Etc/UTC');
/*
  TODO:
  -Then: import logger to all API methods ==> in testing, make sure to simulate an error
  -Then: create new route for client side logging + test
  -Then: call route at all points for client-side errors
    -Will want to include meta data of what exactly is causing the client-side error
    -Maybe want to include other contextual information... set up structure such that contextual information can be set and sent later on

 */

module.exports.job = job;