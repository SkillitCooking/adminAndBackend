var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var TrainingVideo = db.trainingVideos;
var Lesson = db.lessons;
var Article = db.articles;


/* GET all trainingVideos */
router.get('/', function(req, res, next) {
  logger.info('START GET api/trainingVideos/');
  TrainingVideo.model.find(function(err, videos) {
    if(err) {
      logger.error('ERROR GET api/trainingVideos/', {error: err});
      return next(err);
    }
    var retVal = {
      data: videos
    };
    logger.info('END GET api/trainingVideos/');
    res.json(retVal);
  });
});

router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/trainingVideos/' + req.params.id);
    TrainingVideo.model.findByIdAndUpdate(req.params.id, req.body.trainingVideo, {new: true}, function(err, video) {
      if (err) {
        logger.error('ERROR PUT api/trainingVideos/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      //adjust affected Articles
      var articleIds = [];
      Article.model.find(function(err, articles) {
        if(err) {
          logger.error('ERROR PUT api/trainingVideos/' + req.params.id + 'in Article.model.find', {videoId: video._id});
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
                  if(chunk.linkedItem && video._id.equals(chunk.linkedItem._id)) {
                    //if below doesn't work, could explicitly define object...
                    articles[i].contentSections[j].contentArray[k].textChunks[l].linkedItem = video;
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
                logger.error('ERROR PUT api/trainingVideos/' + req.params.id + 'in Article.model.save', {videoId: video._id});
                return next(err);
              }
            });
            articleIds.push(articles[i]._id);
          }
        }
        logger.info('END PUT api/trainingVideos/' + req.params.id);
        res.json({data: video, affectedArticleIds: articleIds});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/trainingVideos/:id', {error: error});
    return next(error);
  }
});

router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/trainingVideos/' + req.params.id);
    TrainingVideo.model.findByIdAndRemove(req.params.id, function(err, video) {
      if (err) {
        logger.error('ERROR DELETE api/trainingVideos/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      //Lesson and Article reference adjustment
      //Below can be made more efficient...
      var lessonIds = [];
      Lesson.model.find(function(err, lessons) {
        if(err) {
          logger.error('ERROR DELETE api/trainingVideos/' + req.params.id + 'in Lesson.model.find', {videoId: video._id});
          return next(err);
        }
        for (var i = lessons.length - 1; i >= 0; i--) {
          if(lessons[i].itemIds && lessons[i].itemIds.length > 0) {
            var itemIds = lessons[i].itemIds;
            for (var j = itemIds.length - 1; j >= 0; j--) {
              if(video._id.equals(itemIds[j].id)) {
                //then need to remove reference
                itemIds.splice(j, 1);
                lessons[i].save(function(err, lesson, numAffected) {
                  if(err) {
                    logger.error('ERROR DELETE api/trainingVideos/' + req.params.id + 'in Lesson.model.save', {videoId: video._id});
                    return next(err);
                  }
                });
                lessonIds.push(lessons[i]._id);
              }
            }
          }
        }
        logger.info('DELETE api/trainingVideos/' + req.params.id + ' - Successful updating of Lesson TrainingVideo references');
      });
      //may be able to make below more efficient too...
      var articleIds = [];
      Article.model.find(function(err, articles) {
        if(err) {
          logger.error('ERROR DELETE api/trainingVideos/' + req.params.id + 'in Article.model.find', {videoId: video._id});
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
                  if(chunk.linkedItem && video._id.equals(chunk.linkedItem._id)) {
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
                logger.error('ERROR DELETE api/trainingVideos/' + req.params.id + 'in Article.model.save', {videoId: video._id});
                return next(err);
              }
            });
            articleIds.push(articles[i]._id);
          }
        }
        logger.info('END DELETE api/trainingVideos/' + req.params.id);
        res.json({data: video, affectedLessonIds: lessonIds, affectedArticleIds: articleIds});
      });
    });
  } catch(error) {
    logger.error('ERROR - exception in DELETE api/trainingVideos/:id', {error: error});
    return next(error);
  }
});

/*POST single trainingVideo*/
router.post('/', function(req, res, next) {
  logger.info('START POST api/trainingVideos/');
  try {
    var query = {'title': req.body.trainingVideo.title};
    TrainingVideo.model.findOne(query, function(err, video) {
      if(err) {
        logger.error('ERROR POST api/trainingVideos/', {error: err, body: req.body});
        return next(err);
      }
      if(video) {
        var retVal = {
          name: "TrainingVideo",
          message: "TrainingVideo with title " + query.title + " already exists!"
        };
        logger.info('START POST api/trainingVideos/');
        res.json(retVal);
      } else {
        var trainingVideo = req.body.trainingVideo;
        trainingVideo.dateAdded = Date.now();
        trainingVideo.dateModified = Date.now();
        TrainingVideo.model.create(trainingVideo, function(err, trainingVideo) {
          if(err) {
            logger.error('ERROR POST api/trainingVideos/', {error: err, body: req.body});
            return next(err);
          }
          var retVal = {
            data: trainingVideo
          };
          logger.info('START POST api/trainingVideos/');
          res.json(retVal);
        });
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/trainingVideos/', {error: error});
    return next(error);
  }
});

router.post('/getTrainingVideosForCollection', function(req, res, next) {
  logger.info('START POST api/trainingVideos/getTrainingVideosForCollection');
  try {
    TrainingVideo.model.find({collectionIds: {$in: [req.body.collectionId]}}, function(err, videos) {
      if(err) {
        logger.error('ERROR POST api/trainingVideos/getTrainingVideosForCollection', {error: err, body: req.body});
        return next(err);
      }
      retVal = {
        data: videos
      };
      logger.info('END POST api/trainingVideos/getTrainingVideosForCollection');
      res.json(retVal);
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/trainingVideos/getTrainingVideosForCollection', {error: error});
    return next(error);
  }
});

module.exports = router;