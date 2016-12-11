var express = require('express');
var app = express();

var constants = require('../util/constants');
var logger = require('../util/logger').serverLogger;

/*
API Password/key checker
 */

module.exports = function(router) {
  router.use(function(req, res, next) {
    var environment = app.get('env');
    console.log('middleware env: ', environment);
    console.log('headers: ', req.headers);
    if(environment === 'production') {
      if(req.headers.password === constants.API_PASSWORD.PROD) {
        next();
      } else {
        logger.error('ERROR - Invalid password sent', {password: req.headers.password, env: environment});
        next({
          status: constants.STATUS_CODES.FORBIDDEN,
          message: 'Don\'t come at me with weak requests like that, broh',
          headers: req.headers
        });
      }
    } else {
      //then we're assuming that staging or dev - so using dev api password
      if(req.headers.password === constants.API_PASSWORD.DEV) {
        next();
      } else {
        logger.error('ERROR - Invalid password sent', {password: req.headers.password, env: environment});
        next({
          status: constants.STATUS_CODES.FORBIDDEN,
          message: 'Don\'t come at me with weak requests like that, broh'
        });
      }
    }
  });
};