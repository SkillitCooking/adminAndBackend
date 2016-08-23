var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var Chapter = db.chapters;

router.get('/', function(req, res, next) {
  logger.info('START GET api/chapters/');
  Chapter.model.find(function(err, chapters) {
    if(err) {
      logger.error('ERROR GET api/chapters/', {error: err});
      return next(err);
    }
    logger.info('END GET api/chapters/');
    res.json({data: chapters});
  });
});

router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/chapters/' + req.params.id);
    Chapter.model.findByIdAndUpdate(req.params.id, req.body.chapter, {new: true}, function(err, chapter) {
      if(err) {
        logger.error('ERROR PUT api/chapters/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      logger.info('END PUT api/chapters/' + req.params.id);
      res.json({data: chapter});
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/chapters/:id', {error: error});
    return next(error);
  }
});

router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/chapters/' + req.params.id);
    Chapter.model.findByIdAndRemove(req.params.id, function(err, chapter) {
      if(err) {
        logger.error('ERROR DELETE api/chapters/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      logger.info('END DELETE api/chapters/' + req.params.id);
      res.json({data: chapter});
    });
  } catch (error) {
    logger.error('ERROR - exception in DELETE api/chapters/:id', {error: error});
    return next(error);
  }
});

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