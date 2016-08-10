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
//May need to have this explicitly run at every app restart
var job = new CronJob({
  cronTime: '00 00 00 * * *', 
  onTick: function() {
    setFormattedDate();
  }, 
  start: true, 
  timeZone: 'Etc/UTC', 
  runOnInit: true
});
/*
  TODO:
  -Then: create cronJob to delete week-old logs... or add to existing job

 */

module.exports.job = job;