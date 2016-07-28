var winston = require('winston');
var localStorage = require('./localStorage').localStorage;

//get current date (to day precison), set filename for api log file
//may have to use CronJob to set the date... we'll see
//may have to use CronJob to reinstantiate the logger for every cycle... any clean up needed?
//^^in cronJob, edit the file name for the loggers on every cycle

function getFileName() {
  var fileName;
  localStorage.get('currentDateString', function(err, reply) {
    if(reply)
      fileName = reply.toString() + '.log';
  });
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