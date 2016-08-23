var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var HowToShopEntry = db.howToShopEntries;

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

router.put(':id', function(req, res, next) {
  try {
    logger.info('ERROR PUT api/howToShopEntries/' + req.params.id);
    HowToShopEntry.findByIdAndUpdate(req.params.id, req.body.entry, {new: true}, function(err, entry) {
      if(err) {
        logger.error('ERROR PUT api/howToShopEntries/' + req.params.id, {error: err});
        return next(err);
      }
      logger.info('END PUT api/howToShopEntries/' + req.params.id);
      res.json({data: entry});
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
      logger.info('END DELETE api/howToShopEntries/' + req.params.id);
      res.json({data: entry});
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
        howToShopEntry.dateAdded = Date.now();
        howToShopEntry.dateModified = Date.now();
        HowToShopEntry.model.create(howToShopEntry, function(err, howToShopEntry) {
          if(err) {
            logger.error('ERROR POST api/howToShopEntries/', {error: err, body: req.body});
            return next(err);
          }
          var retVal = {
            data: howToShopEntry
          };
          logger.info('END POST api/howToShopEntries/');
          res.json(howToShopEntry);
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