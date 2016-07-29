var express = require('express');
var router = express.Router();

var loggers = require('../../util/logger');

router.post('/logError', function(req, res, next) {
  loggers.serverLogger.info('START POST api/clientLogging/logError');
  //expect an 'errInfo' property of body, then just log that. The client will
  //be responsible for populating it with more specific information
  if(req.body.errInfo) {
    loggers.clientLogger.error('ERROR: ' + req.body.errInfo.source, {err: errInfo});
    res.json({message: 'Error successfully logged'});
  } else {
    loggers.serverLogger.error('ERROR POST api/clientLogging/logError', {error: 'no "errInfo" property on req.body', body: req.body});
    res.json({message: 'Unsuccessful call: did not have expected information'});
  }
});

module.exports = router;