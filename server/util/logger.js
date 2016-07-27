var winston = require('winston');

//get current date (to day precison), set filename for api log file
//may have to use CronJob to set the date... we'll see
//could use redis to store current fileName...yes

function getFileName() {
  var today = new Date();
  var month = now.getUTCMonth() + 1; //to offset 0-11 default mapping
  var day = now.getUTCDate();
  var year = now.getUTCYear();
  return month + day + year;
}

var dailyLogFileName = getFileName();

var clientLogger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'client-error-logs',
      filename: 'logs/client/' + dailyLogFileName,
      level: 'error'
    })
  ]
});

var serverLogger = new (winston.Logger)({
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

module.exports.serverLogger = serverLogger;
module.exports.clientLogger = clientLogger;