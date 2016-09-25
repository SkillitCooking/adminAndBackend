var winston = require('winston');
//var moment = require('moment');
//var localStorage = require('./localStorage').localStorage;

/*function getFileName() {
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
}*/

var clientLogger, serverLogger;

if(process.env.NODE_ENV === 'production') {
  //then set up actual loggers
  /*getFileName().then(function(dailyLogFileName) {
    console.log('logger dailyLogFileName: ', dailyLogFileName);

    
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
  });*/
clientLogger = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({
        name: 'client-error-logs',
        filename: '../logs/client/clientErrors.log',
        level: 'error',
        maxsize: 100 * 1024,
        maxFiles: 10
      })
    ]
  });

  serverLogger = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({
        name: 'api-logs',
        filename: '../logs/api/callLogs/calls.log',
        level: 'info',
        maxsize: 100 * 1024,
        maxFiles: 3
      }),
      new (winston.transports.File)({
        name: 'server-error-logs',
        filename: '../logs/api/errors/errors.log',
        level: 'error',
        maxsize: 100 * 1024,
        maxFiles: 5
      })
    ]
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
}
module.exports.serverLogger = serverLogger;
module.exports.clientLogger = clientLogger;