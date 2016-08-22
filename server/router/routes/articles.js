var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var Article = db.articles;

router.get('/', function(req, res, next) {
  logger.info('START GET api/articles/');
  try {
    Article.model.find(function(err, articles) {
      if(err) {
        logger.error('ERROR GET api/articles/', {error: err});
        return next(err);
      }
      logger.info('END GET api/articles/');
      res.json({data: articles});
    });
  } catch(error) {
    logger.error('ERROR - exception in GET api/articles/', {error: error});
    return next(error);
  }
});

router.put('/:id', function(req, res, next) {
  logger.info('START PUT api/articles/' + req.params.id);
  try {
    Article.model.findByIdAndUpdate(req.params.id, req.body.article, {new: true}, function(err, article) {
      if(err) {
        logger.error('ERROR PUT api/articles/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      logger.info('END PUT api/articles/' + req.params.id);
      res.json({data: article});
    });
  } catch(error) {
    logger.error('ERROR - exception in PUT api/articles/:id', {error: error});
    return next(error);
  }
});

router.delete('/:id', function(req, res, next) {
  logger.info('START DELETE api/articles/' + req.params.id);
  try {
    Article.model.findByIdAndRemove(req.params.id, function(err, article) {
      if(err) {
        logger.error('ERROR DELETE api/articles/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      logger.info('END DELETE api/articles/' + req.params.id);
      res.json({data: article});
    });
  } catch(error) {
    logger.error('ERROR - exception in DELETE api/articles/:id', {error: error});
    return next(error);
  }
});

router.get('/getArticlesTitleId', function(req, res, next) {
  logger.info('START GET api/articles/getArticlesTitleId');
  try {
    Article.model.find({}, '_id title', function(err, articles) {
      if(err) {
        logger.error('GET api/articles/getArticlesTitleId', {error: error});
        return next(error);
      }
      var retVal = {
        data: articles
      };
      logger.info('END GET api/articles/getArticlesTitleId');
      res.json(retVal);
    });
  } catch (error) {
    logger.error('ERROR - exception in GET api/articles/getArticlesTitleId', {error: error});
    return next(error);
  }
});

router.post('/', function(req, res, next) {
  logger.info('START POST api/articles/');
  try {
    var query = {'title': req.body.article.title};
    Article.model.findOneAndUpdate(query, req.body.article, {upsert: true}, function(err, article) {
      if(err) {
        logger.error('ERROR POST api/articles/', {error: err});
        return next(err);
      }
      if(article === null) {
        //then inserted, and need it to return
        Article.model.findOne(query, function(err, article) {
          if(err) {
            logger.error('ERROR POST api/articles/', {error: err, body: req.body});
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
    return next(error);
  }
});


module.exports = router;