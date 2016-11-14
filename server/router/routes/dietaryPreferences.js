var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;
var underscore = require('underscore');
var constants = require('../../util/constants');

var mongoose = require('mongoose');

var db = require('../../database');
var DietaryPreference = db.dietaryPreferences;

//get all dietaryPreferences
router.get('/', function(req, res, next) {
  logger.info('START GET api/dietaryPreferences/');
  DietaryPreference.model.find(function(err, prefs) {
    if(err) {
      logger.error('ERROR GET api/dietaryPreferences/', {error: err});
      return next(err);
    }
    logger.info('END GET api/dietaryPreferences/');
    res.json({data: prefs});
  });
});

router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/dietaryPreferences/' + req.params.id);
    req.body.dietaryPreference.dateModified = Date.parse(new Date().toUTCString());
    DietaryPreference.model.findByIdAndUpdate(req.params.id, req.body.dietaryPreference, {new: true, setDefaultsOnInsert: true}, function(err, pref) {
      if(err) {
        logger.error('ERROR PUT api/dietaryPreferences/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      logger.info('END PUT api/dietaryPreferences/' + req.params.id);
      res.json({data: pref});
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/dietaryPreferences/:id', {error: error});
    return next(error);
  }
});

router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/dietaryPreferences/' + req.params.id);
    DietaryPreference.model.findByIdAndRemove(req.params.id, function(err, pref) {
      if(err) {
        logger.error('ERROR DELETE api/dietaryPreferences/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      logger.info('END DELETE api/dietaryPreferences/' + req.params.id);
      res.json({data: pref});
    });
  } catch (error) {
    logger.error('ERROR - exception in DELETE api/dietaryPreferences/:id', {error: error});
    return next(error);
  }
});

router.post('/', function(req, res, next) {
  logger.info('START POST api/dietaryPreferences/');
  try {
    var query = {'title': req.body.dietaryPreference.title};
    req.body.dietaryPreference.dateModified = Date.parse(new Date().toUTCString());
    DietaryPreference.model.findOneAndUpdate(query, req.body.dietaryPreference, {upsert: true, setDefaultsOnInsert: true}, function(err, pref) {
      if(err) {
        logger.error('ERROR POST api/dietaryPreferences/', {error: err});
        return next(err);
      }
      if(pref === null) {
        //then inserted, and need it to return
        DietaryPreference.model.findOne(query, function(err, pref) {
          if(err) {
            logger.error('ERROR POST api/dietaryPreferences/', {error: err});
            return next(err);
          }
          logger.info('END POST api/dietaryPreferences/');
          res.json({data: pref});
        });
      } else {
        //then updated
        logger.info('END POST api/dietaryPreferences/');
        res.json({data: pref});
      }
    });
  } catch (error) {
    logger.error('ERROR - excpetion in POST api/dietaryPreferences/', {error: error});
    return next(error);
  }
});

module.exports = router;