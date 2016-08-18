var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var Article = db.articles;

router.get('/getArticlesTitleId', function(req, res, next) {
  logger.info('START GET api/articles/getArticlesTitleId');
  try {
    Article.model.find({}, '_id title', function(err, articles) {
      if(err) {
        logger.error('GET api/articles/getArticlesTitleId', {error: error});
        next(error);
      }
      var retVal = {
        data: articles
      };
      logger.info('END GET api/articles/getArticlesTitleId');
      res.json(retVal);
    });
  } catch (error) {
    logger.error('ERROR - exception in GET api/articles/getArticlesTitleId', {error: error});
    next(error);
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
    next(error);
  }
});


module.exports = router;