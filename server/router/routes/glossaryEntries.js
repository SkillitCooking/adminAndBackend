var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);

var logger = require('../../util/logger').serverLogger;
var mailingService = require('../lib/mailingService');

var mongoose = require('mongoose');
var db = require('../../database');
var GlossaryEntry = db.glossaryEntries;
var Article = db.articles;
var Lesson = db.lessons;

/*GET all glossarys*/
router.get('/', function(req, res, next) {
  logger.info('START GET api/glossaryEntries/');
  GlossaryEntry.model.find(function(err, entries) {
    if(err) {
      logger.error('ERROR GET api/glossaryEntries/', {error: err});
      mailingService.mailServerError({error: err, location: 'GET api/glossaryEntries/'});
      return next(err);
    }
    var retVal = {
      data: entries
    };
    logger.info('END GET api/glossaryEntries/');
    res.json(retVal);
  });
});

router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/glossaryEntries/' + req.params.id);
    req.body.entry.dateModified = Date.parse(new Date().toUTCString());
    GlossaryEntry.model.findByIdAndUpdate(req.params.id, req.body.entry, {new: true, setDefaultsOnInsert: true}, function(err, entry) {
      if(err) {
        logger.error('ERROR PUT api/glossaryEntries/' + req.params.id, {error: err});
        mailingService.mailServerError({error: err, location: 'PUT api/glossaryEntries/' + req.params.id});
        return next(err);
      }
      //adjust affected Articles
      var articleIds = [];
      Article.model.find(function(err, articles) {
        if(err) {
          logger.error('ERROR PUT api/glossaryEntries/' + req.params.id + 'in Article.model.find', {glossaryId: entry._id});
          mailingService.mailServerError({error: err, location: 'PUT api/glossaryEntries/' + req.params.id, extra: 'Article.find'});
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
                logger.error('ERROR PUT api/glossaryEntries/' + req.params.id + 'in Article.model.save', {glossaryId: entry._id});
                 mailingService.mailServerError({error: err, location: 'PUT api/glossaryEntries/' + req.params.id, extra: 'Article.save'});
                return next(err);
              }
            });
            articleIds.push(articles[i]._id);
          }
        }
        logger.info('END PUT api/glossaryEntries/' + req.params.id);
        res.json({data: entry, affectedArticleIds: articleIds});
      });
    });
  } catch(error) {
    logger.error('ERROR - exception in PUT api/glossaryEntries/:id', {error: error});
     mailingService.mailServerError({error: error, location: 'EXCEPTION PUT api/glossaryEntries/:id'});
    return next(error);
  }
});

router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/glossaryEntries/' + req.params.id);
    GlossaryEntry.model.findByIdAndRemove(req.params.id, function(err, entry) {
      if(err) {
        logger.error('ERROR DELETE api/glossaryEntries/' + req.params.id, {error: err});
         mailingService.mailServerError({error: err, location: 'DELETE api/glossaryEntries/' + req.params.id});
        return next(err);
      }
      //Lesson and Article reference adjustment
      //Below can be made more efficient...
      var lessonIds = [];
      Lesson.model.find(function(err, lessons) {
        if(err) {
          logger.error('ERROR DELETE api/glossaryEntries/' + req.params.id + 'in Lesson.model.find', {glossaryId: entry._id});
           mailingService.mailServerError({error: err, location: 'DELETE api/glossaryEntries/' + req.params.id, extra: 'Lesson.find'});
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
                  logger.error('ERROR DELETE api/glossaryEntries/' + req.params.id + 'in Lesson.model.save', {glossaryId: entry._id});
                   mailingService.mailServerError({error: err, location: 'DELETE api/glossaryEntries/' + req.params.id, extra: 'Lesson.save'});
                  return next(err);
                }
              });
              lessonIds.push(lessons[i]._id);
            }
          }
        }
        logger.info('DELETE api/glossaryEntries/' + req.params.id + ' - Successful updating of Lesson GlossaryEntry references');
      });
      //may be able to make below more efficient too...
      var articleIds = [];
      Article.model.find(function(err, articles) {
        if(err) {
          logger.error('ERROR DELETE api/glossaryEntries/' + req.params.id + 'in Article.model.find', {glossaryId: entry._id});
           mailingService.mailServerError({error: err, location: 'DELETE api/glossaryEntries/' + req.params.id, extra: 'Article.find'});
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
                logger.error('ERROR DELETE api/glossaryEntries/' + req.params.id + 'in Article.model.save', {glossaryId: entry._id});
                mailingService.mailServerError({error: err, location: 'DELETE api/glossaryEntries/' + req.params.id, extra: 'Article.save'});
                return next(err);
              }
            });
            articleIds.push(articles[i]._id);
          }
        }
        logger.info('END DELETE api/glossaryEntries/' + req.params.id);
        res.json({data: entry, affectedLessonIds: lessonIds, affectedArticleIds: articleIds});
      });
    });
  } catch(error) {
    logger.error('ERROR - exception in DELETE api/glossaryEntries/:id', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION DELETE api/glossaryEntries/'});
    return next(error);
  }
});

/*POST a glossaryEntry*/
router.post('/', function(req, res, next) {
  //check if title already exists
  logger.info('START POST api/glossaryEntries/');
  try {
    var query = {'title': req.body.glossaryEntry.title};
    GlossaryEntry.model.findOne(query, function(err, entry) {
      if(err) {
        logger.error('ERROR POST api/glossaryEntries/', {error: err, body: req.body});
        mailingService.mailServerError({error: err, location: 'POST api/glossaryEntries/'});
        return next(err);
      }
      if(entry) {
        var retVal = {
          name: "GlossaryEntry",
          message: "GlossaryEntry with title " + query.title + " already exists!"
        };
        logger.info('END POST api/glossaryEntries/');
        res.json(retVal);
      } else {
        var glossaryEntry = req.body.glossaryEntry;
        glossaryEntry.dateAdded = Date.parse(new Date().toUTCString());
        glossaryEntry.dateModified = Date.parse(new Date().toUTCString());
        GlossaryEntry.model.create(glossaryEntry, function(err, glossaryEntry) {
          if(err) {
            logger.error('ERROR POST api/glossaryEntries/', {error: err, body: req.body});
            mailingService.mailServerError({error: err, location: 'POST api/glossaryEntries/' + req.params.id, extra: 'GlossaryEntry.create'});
            return next(err);
          }
          retVal = {
            data: glossaryEntry
          };
          logger.info('END POST api/glossaryEntries/');
          res.json(retVal);
        });
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/glossaryEntries/', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/glossaryEntries/'});
    return next(error);
  }
});

router.post('/getGlossarysForCollection', function(req, res, next) {
  logger.info('START POST api/glossaryEntries/getGlossarysForCollection');
  try {
    GlossaryEntry.model.find({collectionIds: {$in: [req.body.collectionId]}}, function(err, entries) {
      if(err) {
        logger.error('ERROR POST api/glossaryEntries/getGlossarysForCollection', {error: err, body: req.body});
        mailingService.mailServerError({error: err, location: 'POST api/glossaryEntries/getGlossarysForCollection'});
        return next(err);
      }
      retVal = {
        data: entries
      };
      logger.info('END POST api/glossaryEntries/getGlossarysForCollection');
      res.json(retVal);
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/glossaryEntries/getGlossarysForCollection', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/glossaryEntries/getGlossarysForCollection'});
    return next(error);
  }
});

module.exports = router;