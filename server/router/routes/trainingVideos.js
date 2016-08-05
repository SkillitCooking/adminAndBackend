var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var TrainingVideo = db.trainingVideos;

/* GET all trainingVideos */
router.get('/', function(req, res, next) {
  logger.info('START GET api/trainingVideos/');
  TrainingVideo.model.find(function(err, videos) {
    if(err) {
      logger.error('ERROR GET api/trainingVideos/', {error: err});
      return next(err);
    }
    var retVal = {
      data: videos
    };
    logger.info('END GET api/trainingVideos/');
    res.json(retVal);
  });
});

/*POST single trainingVideo*/
router.post('/', function(req, res, next) {
  logger.info('START POST api/trainingVideos/');
  try {
    var query = {'title': req.body.trainingVideo.title};
    TrainingVideo.model.findOne(query, function(err, video) {
      if(err) {
        logger.error('ERROR POST api/trainingVideos/', {error: err, body: req.body});
        return next(err);
      }
      if(video) {
        var retVal = {
          name: "TrainingVideo",
          message: "TrainingVideo with title " + query.title + " already exists!"
        };
        logger.info('START POST api/trainingVideos/');
        res.json(retVal);
      } else {
        var trainingVideo = req.body.trainingVideo;
        trainingVideo.dateAdded = Date.now();
        trainingVideo.dateModified = Date.now();
        TrainingVideo.model.create(trainingVideo, function(err, trainingVideo) {
          if(err) {
            logger.error('ERROR POST api/trainingVideos/', {error: err, body: req.body});
            return next(err);
          }
          var retVal = {
            data: trainingVideo
          };
          logger.info('START POST api/trainingVideos/');
          res.json(retVal);
        });
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/trainingVideos/', {error: error});
    next(error);
  }
});

router.post('/getTrainingVideosForCollection', function(req, res, next) {
  logger.info('START POST api/trainingVideos/getTrainingVideosForCollection');
  try {
    TrainingVideo.model.find({collectionIds: {$in: [req.body.collectionId]}}, function(err, videos) {
      if(err) {
        logger.error('ERROR POST api/trainingVideos/getTrainingVideosForCollection', {error: err, body: req.body});
        return next(err);
      }
      retVal = {
        data: videos
      };
      logger.info('END POST api/trainingVideos/getTrainingVideosForCollection');
      res.json(retVal);
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/trainingVideos/getTrainingVideosForCollection', {error: error});
    next(error);
  }
});

module.exports = router;