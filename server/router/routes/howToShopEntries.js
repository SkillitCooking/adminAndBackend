var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var HowToShopEntry = db.howToShopEntries;
var Lesson = db.lessons;
var Article = db.articles;

/*GET all howToShopEntries*/
router.get('/', function(req, res, next) {
  logger.info('START GET api/howToShopEntries/');
  HowToShopEntry.model.find(function(err, entries) {
    if(err) {
      logger.error('ERROR GET api/howToShopEntries/', {error: err});
      return next(err);
    }
    var retVal = {
      data: entries
    };
    logger.info('END GET api/howToShopEntries/');
    res.json(retVal);
  });
});

router.put('/:id', function(req, res, next) {
  try {
    logger.info('ERROR PUT api/howToShopEntries/' + req.params.id);
    req.body.entry.dateModified = Date.parse(new Date().toUTCString());
    HowToShopEntry.model.findByIdAndUpdate(req.params.id, req.body.entry, {new: true, setDefaultsOnInsert: true}, function(err, entry) {
      if(err) {
        logger.error('ERROR PUT api/howToShopEntries/' + req.params.id, {error: err});
        return next(err);
      }
      //adjust affected Articles
      var articleIds = [];
      Article.model.find(function(err, articles) {
        if(err) {
          logger.error('ERROR PUT api/howToShopEntries/' + req.params.id + 'in Article.model.find', {howToShopId: entry._id});
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
                  if(chunk.linkedItem && entry._id.equals(chunk.linkedItem._id)) {
                    //if below doesn't work, could explicitly define object...
                    articles[i].contentSections[j].contentArray[k].textChunks[l].linkedItem = entry;
                    articles[i].markModified('contentSections');
                    articleChanged = true;
                  }
                }
              }
            }
          }
          if(articleChanged) {
            articles[i].dateModified = Date.parse(new Date().toUTCString());
            articles[i].save(function(err, article, numAffected) {
              if(err) {
                logger.error('ERROR PUT api/howToShopEntries/' + req.params.id + 'in Article.model.save', {howToShopId: entry._id});
                return next(err);
              }
            });
            articleIds.push(articles[i]._id);
          }
        }
        logger.info('END PUT api/howToShopEntries/' + req.params.id);
        res.json({data: entry, affectedArticleIds: articleIds});
      });
    });
  } catch(error) {
    logger.error('ERROR - exception in PUT api/howToShopEntries/:id', {error: error});
    return next(error);
  }
});

router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/howToShopEntries/' + req.params.id);
    HowToShopEntry.model.findByIdAndRemove(req.params.id, function(err, entry) {
      if(err) {
        logger.error('ERROR DELETE api/howToShopEntries/' + req.params.id, {error: err});
        return next(err);
      }
      //Lesson and Article reference adjustment
      //Below can be made more efficient...
      var lessonIds = [];
      Lesson.model.find(function(err, lessons) {
        if(err) {
          logger.error('ERROR DELETE api/howToShopEntries/' + req.params.id + 'in Lesson.model.find', {howToShopId: entry._id});
          return next(err);
        }
        for (var i = lessons.length - 1; i >= 0; i--) {
          if(lessons[i].itemIds && lessons[i].itemIds.length > 0) {
            var itemIds = lessons[i].itemIds;
            var lessonChanged = false;
            for (var j = itemIds.length - 1; j >= 0; j--) {
              if(entry._id.equals(itemIds[j].id)) {
                //then need to remove reference
                itemIds.splice(j, 1);
                lessonChanged = true;
              }
            }
            if(lessonChanged) {
              lessons[i].dateModified = Date.parse(new Date().toUTCString());
              lessons[i].save(function(err, lesson, numAffected) {
                if(err) {
                  logger.error('ERROR DELETE api/howToShopEntries/' + req.params.id + 'in Lesson.model.save', {howToShopId: entry._id});
                  return next(err);
                }
              });
              lessonIds.push(lessons[i]._id);
            }
          }
        }
        logger.info('DELETE api/howToShopEntries/' + req.params.id + ' - Successful updating of Lesson HowToShopEntry references');
      });
      //may be able to make below more efficient too...
      var articleIds = [];
      Article.model.find(function(err, articles) {
        if(err) {
          logger.error('ERROR DELETE api/howToShopEntries/' + req.params.id + 'in Article.model.find', {howToShopId: entry._id});
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
                  if(chunk.linkedItem && entry._id.equals(chunk.linkedItem._id)) {
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
            articles[i].dateModified = Date.parse(new Date().toUTCString());
            articles[i].save(function(err, article, numAffected) {
              if(err) {
                logger.error('ERROR DELETE api/howToShopEntries/' + req.params.id + 'in Article.model.save', {howToShopId: entry._id});
                return next(err);
              }
            });
            articleIds.push(articles[i]._id);
          }
        }
        logger.info('END DELETE api/howToShopEntries/' + req.params.id);
        res.json({data: entry, affectedLessonIds: lessonIds, affectedArticleIds: articleIds});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in DELETE api/howToShopEntries/:id', {error: error});
    return next(error);
  }
});

/*POST single howToShopEntry*/
router.post('/', function(req, res, next) {
  logger.info('START POST api/howToShopEntries/');
  try {
    var query = {'title': req.body.howToShopEntry.title};
    HowToShopEntry.model.findOne(query, function(err, entry) {
      if(err) {
        logger.error('ERROR POST api/howToShopEntries/', {error: err, body: req.body});
        return next(err);
      }
      if(entry) {
        var retVal = {
          name: "HowToShopEntry",
          message: "HowToShopEntry with title " + query.title + " already exists!"
        };
        logger.info('END POST api/howToShopEntries/');
        res.json(retVal);
      } else {
        var howToShopEntry = req.body.howToShopEntry;
        howToShopEntry.dateAdded = Date.parse(new Date().toUTCString());
        howToShopEntry.dateModified = Date.parse(new Date().toUTCString());
        HowToShopEntry.model.create(howToShopEntry, function(err, howToShopEntry) {
          if(err) {
            logger.error('ERROR POST api/howToShopEntries/', {error: err, body: req.body});
            return next(err);
          }
          var retVal = {
            data: howToShopEntry
          };
          logger.info('END POST api/howToShopEntries/');
          res.json(retVal);
        });
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/howToShopEntries/', {error: error});
    return next(error);
  }
});

/* getHowToShopForCollection */
router.post('/getHowToShopForCollection', function(req, res, next) {
  logger.info('START POST api/howToShopEntries/getHowToShopForCollection');
  try {
    HowToShopEntry.model.find({collectionIds: {$in: [req.body.collectionId]}}, function(err, entries) {
      if(err) {
        logger.error('ERROR POST api/howToShopEntries/getHowToShopForCollection', {error: err, body: req.body});
        return next(err);
      }
      var retVal = {
        data: entries
      };
      logger.info('END POST api/howToShopEntries/getHowToShopForCollection');
      res.json(retVal);
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/howToShopEntries/getHowToShopForCollection', {error: error});
    return next(error);
  }
});

module.exports = router;