var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var DailyTip = db.dailyTips;
var Lesson = db.lessons;
var Article = db.articles;

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

/* PUT dailyTip */
router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/dailyTips/' + req.params.id);
    DailyTip.model.findByIdAndUpdate(req.params.id, req.body.tip, {new: true}, function(err, tip) {
      if(err) {
        logger.error('ERROR PUT api/dailyTips/' + req.params.id);
        return next(err);
      }
      //adjust affected Articles
      var articleIds = [];
      Article.model.find(function(err, articles) {
        if(err) {
          logger.error('ERROR PUT api/dailyTips/' + req.params.id + 'in Article.model.find', {tipId: tip._id});
          return next(err);
        }
        for (var i = articles.length - 1; i >= 0; i--) {
          var articleChanged = false;
          for (var j = articles[i].contentSections.length - 1; j >= 0; j--) {
            var contentSection = articles[i].contentSections[j];
            for (var k = contentSection.contentArray.length - 1; k >= 0; k--) {
              var piece = contentSection.contentArray[k];
              if(piece.type === 'text') {
                for (var l = piece.textChunks.length - 1; l >= 0; l--) {
                  var chunk = piece.textChunks[l];
                  if(chunk.linkedItem && tip._id.equals(chunk.linkedItem._id)) {
                    //if below doesn't work, could explicitly define object...
                    articles[i].contentSections[j].contentArray[k].textChunks[l].linkedItem = tip;
                    articles[i].markModified('contentSections');
                    articleChanged = true;
                  }
                }
              }
            }
          }
          if(articleChanged) {
            articles[i].save(function(err, article, numAffected) {
              if(err) {
                logger.error('ERROR PUT api/dailyTips/' + req.params.id + 'in Article.model.save', {tipId: tip._id});
                return next(err);
              }
            });
            articleIds.push(articles[i]._id);
          }
        }
        logger.info('END PUT api/dailyTips/' + req.params.id);
        res.json({data: tip, affectedArticleIds: articleIds});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/dailyTips/:id', {error: error});
    return next(error);
  }
});

/* DELETE single DailyTip */
router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/dailyTips/' + req.params.id);
    DailyTip.model.findByIdAndRemove(req.params.id, function(err, tip) {
      if(err) {
        logger.error('ERROR DELETE api/dailyTips/' + req.params.id);
        return next(err);
      }
      //Lesson and Article reference adjustment
      //Below can be made more efficient...
      var lessonIds = [];
      Lesson.model.find(function(err, lessons) {
        if(err) {
          logger.error('ERROR DELETE api/dailyTips/' + req.params.id + 'in Lesson.model.find', {tipId: tip._id});
          return next(err);
        }
        for (var i = lessons.length - 1; i >= 0; i--) {
          if(lessons[i].itemIds && lessons[i].itemIds.length > 0) {
            var itemIds = lessons[i].itemIds;
            for (var j = itemIds.length - 1; j >= 0; j--) {
              if(tip._id.equals(itemIds[j].id)) {
                //then need to remove reference
                itemIds.splice(j, 1);
                lessons[i].save(function(err, lesson, numAffected) {
                  if(err) {
                    logger.error('ERROR DELETE api/dailyTips/' + req.params.id + 'in Lesson.model.save', {tipId: tip._id});
                    return next(err);
                  }
                });
                lessonIds.push(lessons[i]._id);
              }
            }
          }
        }
        logger.info('DELETE api/dailyTips/' + req.params.id + ' - Successful updating of Lesson DailyTip references');
      });
      //may be able to make below more efficient too...
      var articleIds = [];
      Article.model.find(function(err, articles) {
        if(err) {
          logger.error('ERROR DELETE api/dailyTips/' + req.params.id + 'in Article.model.find', {tipId: tip._id});
          return next(err);
        }
        for (var i = articles.length - 1; i >= 0; i--) {
          var articleChanged = false;
          for (var j = articles[i].contentSections.length - 1; j >= 0; j--) {
            var contentSection = articles[i].contentSections[j];
            for (var k = contentSection.contentArray.length - 1; k >= 0; k--) {
              var piece = contentSection.contentArray[k];
              if(piece.type === 'text') {
                for (var l = piece.textChunks.length - 1; l >= 0; l--) {
                  var chunk = piece.textChunks[l];
                  if(chunk.linkedItem && tip._id.equals(chunk.linkedItem._id)) {
                    //if below doesn't work, could explicitly define object...
                    articles[i].contentSections[j].contentArray[k].textChunks[l].linkedItem = undefined;
                    articles[i].contentSections[j].contentArray[k].textChunks[l].itemType = undefined;
                    articles[i].markModified('contentSections');
                    articleChanged = true;
                  }
                }
              }
            }
          }
          if(articleChanged) {
            articles[i].save(function(err, article, numAffected) {
              if(err) {
                logger.error('ERROR DELETE api/dailyTips/' + req.params.id + 'in Article.model.save', {tipId: tip._id});
                return next(err);
              }
            });
            articleIds.push(articles[i]._id);
          }
        }
        logger.info('END DELETE api/dailyTips/' + req.params.id);
        res.json({data: tip, affectedLessonIds: lessonIds, affectedArticleIds: articleIds});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in DELETE api/dailyTips/:id', {error: error});
    return next(error);
  }
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
        return next(error);
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/dailyTips/', {error: error});
    return next(error);
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
    return next(error);
  }
});

/* dummy route */
router.post('/dummy', function(req, res, next) {
  res.json({message: 'I am a dummy route'});
});

module.exports = router;