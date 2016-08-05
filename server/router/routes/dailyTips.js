var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var DailyTip = db.dailyTips;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

/* GET all DailyTips */
router.get('/', function(req, res, next) {
  logger.info('START GET api/dailyTips/');
  DailyTip.model.find(function (err, tips) {
    if(err) {
      logger.error('ERROR GET api/dailyTips/', {error: err});
      return next(err);
    }
    var retVal = {
      data: tips
    };
    res.json(retVal);
    logger.info('END GET api/dailyTips/');
  });
});

/* POST single DailyTip */
router.post('/', function(req, res, next) {
  //need any existence checks? probably for title...
  logger.info('START POST api/dailyTips/');
  try {
    var query = {'title': req.body.dailyTip.title};
    DailyTip.model.findOne(query, function(err, dailyTip) {
      if(err) {
        logger.error('ERROR POST api/dailyTips/', {error: err, body: req.body});
        return next(err);
      }
      try {
        if(dailyTip) {
          //then found
          var retVal = {
            name: "DailyTip Title",
            message: "DailyTip with title " + query.title + " already exists!"
          };
          logger.info('END POST api/dailyTips/');
          res.json(retVal);
        } else {
          //will need to set the applicable dates first here, which will require the use of moment.js library
          var postedTip = req.body.dailyTip;
          postedTip.dateAdded = Date.now();
          postedTip.dateModified = Date.now();
          //null date
          postedTip.dateFeatured = new Date(0);
          DailyTip.model.create(postedTip, function(err, dailyTip) {
            if(err) {
              logger.error('ERROR POST api/dailyTips/', {error: err, body: req.body});
              return next(err);
            }
            var retVal = {
              data: dailyTip
            };
            logger.info('END POST api/dailyTips/');
            res.json(retVal);
          });
        }
      } catch (error) {
        logger.error('ERROR - exception in POST api/dailyTips/', {error: error});
        next(error);
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/dailyTips/', {error: error});
    next(error);
  }
});

/* get tips of the day */
router.post('/getTipsOfTheDay', function(req, res, next) {
  logger.info('START POST api/dailyTips/getTipsOfTheDay');
  DailyTip.model.find()
  .or([{hasBeenDailyTip: true}, {isTipOfTheDay: true}])
  .sort('-isTipOfTheDay -dateFeatured')
  .select('_id title text dateFeatured picture video')
  .exec(function(err, tips) {
    if(err) {
      logger.error('ERROR POST api/dailyTips/getTipsOfTheDay', {error: err});
      return next(err);
    }
    var retVal = {
      data: tips
    };
    logger.info('END POST api/dailyTips/getTipsOfTheDay');
    res.json(retVal);
  });
});

/* getTipsForCollection */
router.post('/getTipsForCollection', function(req, res, next) {
  //find tips where collectionIds include collectionId
  logger.info('START POST api/dailyTips/getTipsForCollection');
  try {
    DailyTip.model.find({collectionIds: {$in: [req.body.collectionId]}}, function(err, tips) {
      if(err) {
        logger.error('ERROR POST api/dailyTips/getTipsForCollection', {error: err, body: req.body});
        return next(err);
      }
      var retVal = {
        data: tips
      };
      logger.info('END POST api/dailyTips/getTipsForCollection');
      res.json(retVal);
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/dailyTips/getTipsForCollection', {error: error});
    next(error);
  }
});

/* dummy route */
router.post('/dummy', function(req, res, next) {
  res.json({message: 'I am a dummy route'});
});

module.exports = router;