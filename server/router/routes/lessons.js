var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var Lesson = db.lessons;

router.get('/', function(req, res, next) {
  logger.info('START GET api/lessons/');
  Lesson.model.find(function(err, lessons) {
    if(err) {
      logger.error('ERROR GET api/lessons/', {error: err});
      return next(err);
    }
    logger.info('END GET api/lessons/');
    res.json({data: lessons});
  });
});

router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/lessons/' + req.params.id);
    Lesson.model.findByIdAndUpdate(req.params.id, req.body.lesson, {new: true}, function(err, lesson) {
      if(err) {
        logger.error('ERROR PUT api/lessons/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      logger.info('END PUT api/lessons/' + req.params.id);
      res.json({data: lesson});
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/lessons/:id', {error: error});
    return next(error);
  }
});

router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/lessons' + req.params.id);
    Lesson.model.findByIdAndRemove(req.params.id, function(err, lesson) {
      if(err) {
        logger.error('ERROR DELETE api/lessons/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      logger.info('END DELETE api/lessons/' + req.params.id);
      res.json({data: lesson});
    });
  } catch (error) {
    logger.error('ERROR - exception in DELETE api/lessons/:id', {error: error});
    return next(error);
  }
});

router.get('/getLessonsForChapterConstruction', function(req, res, next) {
  logger.info('START GET api/lessons/getLessonsForChapterConstruction');
  Lesson.model.find({}, 'name _id timeEstimate', function(err, lessons) {
    if(err) {
      logger.error('ERROR GET api/lessons/getLessonsForChapterConstruction', {error: err});
      return next(err);
    }
    var retVal = {
      lessons: lessons
    };
    res.json(retVal);
    logger.info('END GET api/lessons/getLessonsForChapterConstruction');
  });
});

router.post('/', function(req, res, next) {
  logger.info('START POST api/lessons/');
  try {
    var query = {'name': req.body.lesson.name};
    Lesson.model.findOneAndUpdate(query, req.body.lesson, {upsert: true}, function(err, lesson) {
      if(err) {
        logger.error('ERROR POST api/lessons/', {error: err});
        return next(err);
      }
      if(lesson === null) {
        //then inserted, and need it to return
        Lesson.model.findOne(query, function(err, lesson) {
          if(err) {
            logger.error('ERROR POST api/lessons/', {error: err});
            return next(err);
          }
          logger.info('END POST api/lessons/');
          var retVal = {
            data: lesson
          };
          res.json(retVal);
        });
      } else {
        //then updated
        logger.info('END POST api/lessons/');
        res.json({data: lesson});
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/lessons/', {error: error});
    return next(error);
  }
});

module.exports = router;