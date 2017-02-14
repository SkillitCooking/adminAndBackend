var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);

var logger = require('../../util/logger').serverLogger;
var mailingService = require('../lib/mailingService');

var mongoose = require('mongoose');
var db = require('../../database');
var Chapter = db.chapters;

router.get('/', function(req, res, next) {
  logger.info('START GET api/chapters/');
  Chapter.model.find(function(err, chapters) {
    if(err) {
      logger.error('ERROR GET api/chapters/', {error: err});
      mailingService.mailServerError({error: err, location: 'GET api/chapters/'});
      return next(err);
    }
    logger.info('END GET api/chapters/');
    res.json({data: chapters});
  });
});

router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/chapters/' + req.params.id);
    req.body.chapter.dateModified = Date.parse(new Date().toUTCString());
    Chapter.model.findByIdAndUpdate(req.params.id, req.body.chapter, {new: true, setDefaultsOnInsert: true}, function(err, chapter) {
      if(err) {
        logger.error('ERROR PUT api/chapters/' + req.params.id, {error: err, body: req.body});
        mailingService.mailServerError({error: err, location: 'PUT api/chapters/' + req.params.id});
        return next(err);
      }
      logger.info('END PUT api/chapters/' + req.params.id);
      res.json({data: chapter});
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/chapters/:id', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION PUT api/chapters/:id'});
    return next(error);
  }
});

router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/chapters/' + req.params.id);
    Chapter.model.findByIdAndRemove(req.params.id, function(err, chapter) {
      if(err) {
        logger.error('ERROR DELETE api/chapters/' + req.params.id, {error: err, body: req.body});
        mailingService.mailServerError({error: err, location: 'DELETE api/chapters/' + req.params.id});
        return next(err);
      }
      logger.info('END DELETE api/chapters/' + req.params.id);
      res.json({data: chapter});
    });
  } catch (error) {
    logger.error('ERROR - exception in DELETE api/chapters/:id', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION DELETE api/chapters/:id'});
    return next(error);
  }
});

router.post('/', function(req, res, next) {
  logger.info('START POST api/chapters/');
  try {
    var query = {'name': req.body.chapter.name};
    req.body.chapter.dateModified = Date.parse(new Date().toUTCString());
    Chapter.model.findOneAndUpdate(query, req.body.chapter, {upsert: true, setDefaultsOnInsert: true}, function(err, chapter) {
      if(err) {
        logger.error('ERROR POST api/chapters/', {error: err});
        mailingService.mailServerError({error: err, location: 'POST api/chapters/'});
        return next(err);
      }
      if(chapter === null) {
        //then inserted, and need it to return
        Chapter.model.findOne(query, function(err, chapter) {
          if(err) {
            logger.error('ERROR POST api/chapters/', {error: err});
            mailingService.mailServerError({error: err, location: 'POST api/chapters/'});
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
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/chapters/'});
    return next(error);
  }
});

module.exports = router;