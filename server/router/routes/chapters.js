var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var Chapter = db.chapters;

router.post('/', function(req, res, next) {
  logger.info('START POST api/chapters/');
  try {
    var query = {'name': req.body.chapter.name};
    Chapter.model.findOneAndUpdate(query, req.body.chapter, {upsert: true}, function(err, chapter) {
      if(err) {
        logger.error('ERROR POST api/chapters/', {error: err});
        return next(err);
      }
      if(chapter === null) {
        //then inserted, and need it to return
        Chapter.model.findOne(query, function(err, chapter) {
          if(err) {
            logger.error('ERROR POST api/chapters/', {error: err});
            return next(err);
          }
          logger.info('END POST api/chapters/');
          var retVal = {
            data: chapter
          };
          res.json(retVal);
        });
      } else {
        //then updated
        logger.info('END POST api/chapters/');
        res.json({data: chapter});
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/chapters/', {error: error});
    return next(error);
  }
});

module.exports = router;