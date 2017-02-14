var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);

var logger = require('../../util/logger').serverLogger;
var constants = require('../../util/constants');
var mailingService = require('../lib/mailingService');

var mongoose = require('mongoose');
var db = require('../../database');

var SeasoningUsed = db.seasoningUsed;
var User = db.users;

router.post('/', function(req, res, next) {
  logger.info('START POST api/seasoningUsed/');
  try {
    if(!req.body.isAnonymous) {
      //user validation
      User.model.findById(req.body.userId, 'curToken', function(err, user) {
        if(err) {
          logger.error('ERROR POST api/seasoningUsed/ in finding a user', {error: err});
          mailingService.mailServerError({error: err, location: 'POST api/seasoningUsed/'});
          return next(err);
        }
        if(user) {
          //token check
          if(!req.body.token && req.body.token !== user.curToken) {
            /*var error = {
              status: constants.STATUS_CODES.UNAUTHORIZED,
              message: 'Credentials for method are missing'
            };
            logger.error('ERROR POST api/seasoningUsed/ - token', {error: error});
            return next(error);*/
          }
        } else {
          //error - no user found from id
          var error = {
            status: constants.STATUS_CODES.UNAUTHORIZED,
            message: 'No user found from supplied id'
          };
          logger.error('ERROR POST api/seasoningUsed/', {error: error, userId: req.body.userId});
          mailingService.mailServerError({error: err, location: 'POST api/seasoningUsed/', extra: 'no user found for id ' + req.boyd.userId});
          return next(error);
        }
      });
    }
    var usedSeasoning = {
      seasoningId: req.body.seasoningId,
      mealCookedId: req.body.mealCookedId,
      isAnonymous: req.body.isAnonymous,
      userId: req.body.userId
    };
    SeasoningUsed.model.create(usedSeasoning, function(err, usedSeasoning) {
      if(err) {
        logger.error('ERROR POST api/seasoningUsed/', {error: err});
        mailingService.mailServerError({error: err, location: 'POST api/seasoningUsed/'});
        return next(err);
      }
      logger.info('END POST api/seasoningUsed/');
      res.json({message: 'success'});
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/seasoningUsed/');
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/seasoningUsed/'});
    return next(error);
  }
});

module.exports = router;