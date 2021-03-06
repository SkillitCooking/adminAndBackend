var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);

var loggers = require('../../util/logger');
var mailingService = require('../lib/mailingService');

router.post('/logError', function(req, res, next) {
  loggers.serverLogger.info('START POST api/clientLogging/logError');
  //expect an 'errInfo' property of body, then just log that. The client will
  //be responsible for populating it with more specific information
  if(req.body.errInfo) {
    //if in production environment
    if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'development') {
      mailingService.mailClientError(req.body.errInfo);
    }
    loggers.clientLogger.error('ERROR: ', {err: req.body.errInfo});
    res.json({message: 'Error successfully logged'});
  } else {
    loggers.serverLogger.error('ERROR POST api/clientLogging/logError', {error: 'no "errInfo" property on req.body', body: req.body});
    res.json({message: 'Unsuccessful call: did not have expected information'});
  }
  loggers.serverLogger.info('END POST api/clientLogging/logError');
});

module.exports = router;