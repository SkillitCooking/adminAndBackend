var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var GlossaryEntry = db.glossaryEntries;

/*GET all glossarys*/
router.get('/', function(req, res, next) {
  logger.info('START GET api/glossaryEntries/');
  GlossaryEntry.model.find(function(err, entries) {
    if(err) {
      logger.error('ERROR GET api/glossaryEntries/', {error: err});
      return next(err);
    }
    var retVal = {
      data: entries
    };
    logger.info('END GET api/glossaryEntries/');
    res.json(retVal);
  });
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
        glossaryEntry.dateAdded = Date.now();
        glossaryEntry.dateModified = Date.now();
        GlossaryEntry.model.create(glossaryEntry, function(err, glossaryEntry) {
          if(err) {
            logger.error('ERROR POST api/glossaryEntries/', {error: err, body: req.body});
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
    next(error);
  }
});

router.post('/getGlossarysForCollection', function(req, res, next) {
  logger.info('START POST api/glossaryEntries/getGlossarysForCollection');
  try {
    GlossaryEntry.model.find({collectionIds: {$in: [req.body.collectionId]}}, function(err, entries) {
      if(err) {
        logger.error('ERROR POST api/glossaryEntries/getGlossarysForCollection', {error: err, body: req.body});
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
    next(error);
  }
});

module.exports = router;