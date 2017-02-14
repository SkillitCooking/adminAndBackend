var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);

var logger = require('../../util/logger').serverLogger;
var mailingService = require('../lib/mailingService');

var mongoose = require('mongoose');
var db = require('../../database');
var Article = db.articles;
var Lesson = db.lessons;

router.get('/', function(req, res, next) {
  logger.info('START GET api/articles/');
  try {
    Article.model.find(function(err, articles) {
      if(err) {
        logger.error('ERROR GET api/articles/', {error: err});
        mailingService.mailServerError({error: err, location: 'GET api/articles'});
        return next(err);
      }
      logger.info('END GET api/articles/');
      res.json({data: articles});
    });
  } catch(error) {
    logger.error('ERROR - exception in GET api/articles/', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION GET api/articles'});
    return next(error);
  }
});

router.get('/getArticlesTitleId', function(req, res, next) {
  logger.info('START GET api/articles/getArticlesTitleId');
  try {
    Article.model.find({}, '_id title', function(err, articles) {
      if(err) {
        logger.error('GET api/articles/getArticlesTitleId', {error: err});
        mailingService.mailServerError({error: err, location: 'GET api/getArticlesTitleId'});
        return next(err);
      }
      var retVal = {
        data: articles
      };
      logger.info('END GET api/articles/getArticlesTitleId');
      res.json(retVal);
    });
  } catch (error) {
    logger.error('ERROR - exception in GET api/articles/getArticlesTitleId', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION GET api/articles'});
    return next(error);
  }
});

router.get('/:id', function(req, res, next) {
  try {
    logger.info('START GET api/articles/' + req.params.id);
    Article.model.findById(req.params.id, function(err, article) {
      if(err) {
        logger.error('ERROR GET api/articles/' + req.params.id, {error: err});
        mailingService.mailServerError({error: err, location: 'GET api/articles/' + req.params.id});
        return next(err);
      }
      res.json({data: article});
    });
  } catch (error) {
    logger.error('ERROR - exception in GET api/articles/:id', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION GET api/articles/:id'});
    return next(error);
  }
});

router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/articles/' + req.params.id);
    req.body.article.dateModified = Date.parse(new Date().toUTCString());
    Article.model.findByIdAndUpdate(req.params.id, req.body.article, {new: true, setDefaultsOnInsert: true}, function(err, article) {
      if(err) {
        logger.error('ERROR PUT api/articles/' + req.params.id, {error: err, body: req.body});
        mailingService.mailServerError({error: err, location: 'PUT api/articles/' + req.params.id});
        return next(err);
      }
      logger.info('END PUT api/articles/' + req.params.id);
      res.json({data: article});
    });
  } catch(error) {
    logger.error('ERROR - exception in PUT api/articles/:id', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION PUT api/articles/:id'});
    return next(error);
  }
});

router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/articles/' + req.params.id);
    Article.model.findByIdAndRemove(req.params.id, function(err, article) {
      if(err) {
        logger.error('ERROR DELETE api/articles/' + req.params.id, {error: err, body: req.body});
        mailingService.mailServerError({error: err, location: 'DELETE api/articles/' + req.params.id});
        return next(err);
      }
      //look for lessons that reference article
      Lesson.model.find({articleId: article._id}, function(err, lessons) {
        if(err) {
          logger.error('ERROR DELETE api/articles/' + req.params.id + ' in Lesson.find call', {error: err, body: req.body, articleId: article._id});
          mailingService.mailServerError({error: err, location: 'PUT api/articles/' + req.params.id, extra: 'Lesson.find call'});
          return next(err);
        }
        var lessonIds = [];
        for (var i = lessons.length - 1; i >= 0; i--) {
          lessons[i].articleId = undefined;
          lessons[i].save(function(err, lesson, numAffected) {
            if(err) {
              logger.error('ERROR DELETE api/articles/' + req.params.id + 'saving lesson with reference article', {error: err, body: req.body, articleId: article._id});
              mailingService.mailServerError({error: err, location: 'PUT api/articles/' + req.params.id, extra: 'Lesson.save call'});
            return next(err);
            }
          });
          lessonIds.push(lessons[i]._id);
        }
        logger.info('END DELETE api/articles/' + req.params.id);
        res.json({data: article, affectedLessonIds: lessonIds});
      });
    });
  } catch(error) {
    logger.error('ERROR - exception in DELETE api/articles/:id', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION DELETE api/articles/' + req.params.id});
    return next(error);
  }
});

router.post('/', function(req, res, next) {
  logger.info('START POST api/articles/');
  try {
    var query = {'title': req.body.article.title};
    req.body.article.dateModified = Date.parse(new Date().toUTCString());
    Article.model.findOneAndUpdate(query, req.body.article, {upsert: true, setDefaultsOnInsert: true}, function(err, article) {
      if(err) {
        logger.error('ERROR POST api/articles/', {error: err});
        mailingService.mailServerError({error: err, location: 'POST api/articles/'});
        return next(err);
      }
      if(article === null) {
        //then inserted, and need it to return
        Article.model.findOne(query, function(err, article) {
          if(err) {
            logger.error('ERROR POST api/articles/', {error: err, body: req.body});
            mailingService.mailServerError({error: err, location: 'POST api/articles/', extra: 'Article.find'});
            return next(err);
          }
          logger.info('END POST api/articles/');
          var retVal = {
            data: article
          };
          res.json(retVal);
        });
      } else {
        //then updated
        logger.info('END POST api/articles/');
        res.json({data: article});
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/articles/', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/articles/'});
    return next(error);
  }
});


module.exports = router;