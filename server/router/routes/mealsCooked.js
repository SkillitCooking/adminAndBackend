var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);

var logger = require('../../util/logger').serverLogger;
var constants = require('../../util/constants');

var mongoose = require('mongoose');
var db = require('../../database');
var MealsCooked = db.mealsCooked;
var User = db.users;

router.post('/', function(req, res, next) {
  logger.info('START POST api/mealsCooked/');
  try {
    if(!req.body.isAnonymous) {
      User.model.findById(req.body.userId, 'curToken', function(err, user) {
        if(err) {
          logger.error('ERROR POST api/mealsCooked/ in finding a user', {error: err});
          mailingService.mailServerError({error: err, location: 'POST api/mealsCooked'});
          return next(err);
        }
        if(user) {
          //token check
          if(!req.body.token && req.body.token !== user.curToken) {
            /*var error = {
              status: constants.STATUS_CODES.UNAUTHORIZED,
              message: 'Credentials for method are missing'
            };
            logger.error('ERROR POST api/mealsCooked - token', {error: error});
            return next(error);*/
          }
        } else {
          //error - no user found from id
          var error = {
            status: constants.STATUS_CODES.UNAUTHORIZED,
            message: 'No user found from supplied id'
          };
          logger.error('ERROR POST api/mealsCooked/', {error: error, userId: req.body.userId});
          mailingService.mailServerError({error: err, location: 'POST api/mealsCooked/', extra: 'no user found for id ' + req.body.userId});
          //handling for bad user ids
          //return next(error);
          var cookedMeal = {
            recipeIds: req.body.recipeIds,
            source: req.body.source,
            userId: req.body.userId,
            ingredientsChosenIds: req.body.ingredientsChosenIds,
            deviceToken: req.body.deviceToken,
            isAnonymous: true
          };
          MealsCooked.model.create(cookedMeal, function(err, meal) {
            if(err) {
              logger.error('ERROR POST api/mealsCooked/', {error: err});
              mailingService.mailServerError({error: err, location: 'POST api/mealsCooked/'});
              return next(err);
            }
            logger.info('END POST api/mealsCooked/');
            res.json({data: meal});
          });
        }
      });
    }
    var cookedMeal = {
      recipeIds: req.body.recipeIds,
      source: req.body.source,
      userId: req.body.userId,
      ingredientsChosenIds: req.body.ingredientsChosenIds,
      deviceToken: req.body.deviceToken,
      isAnonymous: req.body.isAnonymous
    };
    MealsCooked.model.create(cookedMeal, function(err, meal) {
      if(err) {
        logger.error('ERROR POST api/mealsCooked/', {error: err});
        mailingService.mailServerError({error: err, location: 'POST api/mealsCooked/'});
        return next(err);
      }
      logger.info('END POST api/mealsCooked/');
      res.json({data: meal});
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/mealsCooked/', {error: error});
    mailingService.mailServerError({error: error, location: 'POST api/mealsCooked/'});
    return next(error);
  }
});

module.exports = router;