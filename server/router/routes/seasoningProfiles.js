var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var SeasoningProfile = db.seasoningProfiles;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

/* GET seasoningProfiles listing. */
router.get('/', function(req, res, next) {
  logger.info('START GET api/seasoningProfiles/');
  SeasoningProfile.model.find(function (err, profiles) {
    if(err) {
      logger.error('ERROR GET api/seasoningProfiles/', {error: err});
      return next(err);
    }
    var retVal = {
      data: profiles
    };
    logger.info('END GET api/seasoningProfiles/');
    res.json(retVal);
  });
});

/* POST /seasoningProfiles */
router.post('/', function(req, res, next) {
  logger.info('START POST api/seasoningProfiles/');
  try {
    var query = {'name': req.body.seasoningProfile.name};
    SeasoningProfile.model.findOneAndUpdate(query, 
      req.body.seasoningProfile, {upsert: true}, 
      function(err, profile) {
        if (err) {
          logger.error('ERROR POST api/seasoningProfiles/', {error: err, body: req.body});
          return next(err);
        }
        if(profile === null) {
          //then inserted, and need it to return
          SeasoningProfile.model.findOne(query, function(err, profile) {
            if(err) {
              logger.error('ERROR POST api/seasoningProfiles/', {error: err, body: req.body});
              return next(err);
            }
            logger.info('END POST api/seasoningProfiles/');
            res.json(profile);
          });
        } else {
          //then updated
          logger.info('END POST api/seasoningProfiles/');
          res.json(profile);
        }
    });
  } catch(error) {
    logger.error('ERROR - exception in POST api/seasoningProfiles/', {error: error});
    return next(error);
  }
});

/* GET /seasoningProfiles/id */
router.get('/:id', function(req, res, next) {
  try {
    logger.info('START GET api/seasoningProfiles/' + req.params.id);
    SeasoningProfile.model.findById(req.params.id, function(err, profile) {
      if (err) {
        logger.error('ERROR POST api/seasoningProfiles/', {error: err, body: req.body});
        return next(err);
      }
      logger.info('END GET api/seasoningProfiles/' + req.params.id);
      res.json(profile);
    });
  } catch (error) {
    logger.error('ERROR - exception in GET api/seasoningProfiles/:id', {error: error});
    return next(error);
  }
});

/* PUT /seasoningProfiles/:id */
router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/seasoningProfiles/' + req.params.id);
    SeasoningProfile.model.findByIdAndUpdate(req.params.id, req.body.seasoningProfile, {new: true}, function(err, profile) {
      if (err) {
        logger.error('ERROR PUT api/seasoningProfiles/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      /* profile is previous value of document */
      logger.info('END PUT api/seasoningProfiles/' + req.params.id);
      res.json({data: profile});
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/seasoningProfiles/:id', {error: error});
    return next(error);
  }
});

/* DELETE /seasoningProfiles/:id */
router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/seasoningProfiles/' + req.params.id);
    SeasoningProfile.model.findByIdAndRemove(req.params.id, function(err, profile) {
      if (err) {
        logger.error('ERROR DELETE api/seasoningProfiles/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      /* profile is the value of just-deleted document */
      logger.info('START DELETE api/seasoningProfiles/' + req.params.id);
      res.json({data: profile});
    });
  } catch(error) {
    logger.error('ERROR - exception in DELETE api/seasoningProfiles/:id', {error: error});
    return next(error);
  }
});

module.exports = router;
