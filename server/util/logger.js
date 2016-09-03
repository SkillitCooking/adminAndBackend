var winston = require('winston');
var localStorage = require('./localStorage').localStorage;

function getFileName() {
  var promise = new Promise(function(resolve, reject) {
    var fileName;
    localStorage.get('currentDateString', function(err, reply) {
      if(err) {
        console.log('Error in getting "currentDateString" from localStorage... cannot really log an error to the logging service...');
        reject(err);
      } else {
        if(reply) {
          console.log('get currentDateString reply: ', reply);
          fileName = reply.toString() + '.log';
          resolve(fileName);
        }
      }
    });
  });
  return promise;
}

var clientLogger, serverLogger;

if(process.env.NODE_ENV === 'production') {
  //then set up actual loggers
  getFileName().then(function(dailyLogFileName) {
    console.log('logger dailyLogFileName: ', dailyLogFileName);

    clientLogger = new (winston.Logger)({
      transports: [
        new (winston.transports.File)({
          name: 'client-error-logs',
          filename: 'logs/client/' + dailyLogFileName,
          level: 'error'
        })
      ]
    });

    serverLogger = new (winston.Logger)({
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
  }, function(error) {
    console.log('logger promise error: ', error);
    serverLogger = {
      info: function() {},
      error: function() {}
    };
    clientLogger = {
      info: function() {},
      error: function() {}
    };
    module.exports.serverLogger = serverLogger;
    module.exports.clientLogger = clientLogger;
  });
  
} else {
  //have dummy loggers with no redis
  serverLogger = {
    info: function() {},
    error: function() {}
  };
  clientLogger = {
    info: function() {},
    error: function() {}
  };
  module.exports.serverLogger = serverLogger;
  module.exports.clientLogger = clientLogger;
}