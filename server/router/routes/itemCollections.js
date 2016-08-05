var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var underscore = require('underscore');
var db = require('../../database');
var ItemCollection = db.itemCollections;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

/* GET all itemCollections - organize by type */
router.get('/', function(req, res, next) {
  logger.info('START GET api/itemCollections/');
  ItemCollection.model.find(function(err, collections) {
    if(err) {
      logger.error('ERROR GET api/itemCollections/', {error: err});
      return next(err);
    }
    var typedCollections = underscore.groupBy(collections, "itemType");
    var retData = {
      data: typedCollections
    };
    logger.info('END GET api/itemCollections/');
    res.json(retData);
  });
});

/* POST */
/* checks for same collection name of given itemType */
router.post('/', function(req, res, next) {
  logger.info('START POST api/itemCollections/');
  try {
    var query = {
      'name': req.body.itemCollection.name,
      'itemType': req.body.itemCollection.itemType
    };
    ItemCollection.model.findOneAndUpdate(query, req.body.itemCollection, {upsert: true}, function(err, collection) {
      if(err) {
        logger.error('ERROR POST api/itemCollections/', {error: err, body: req.body});
        return next(err);
      }
      if(collection === null) {
        //then inserted, and need to return it
        ItemCollection.model.findOne(query, function(err, collection) {
          if(err) {
            logger.error('ERROR POST api/itemCollections/', {error: err, body: req.body});
            return next(err);
          }
          var retVal = {
            data: collection
          };
          logger.info('END POST api/itemCollections/');
          res.json(retVal);
        });
      } else {
        //then updated
        retVal = {
          data: collection
        };
        logger.info('END POST api/itemCollections/');
        res.json(retVal);
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/itemCollections/', {error: error});
    next(error);
  }
});

/* get collections for itemType */
router.post('/getCollectionsForItemType', function(req, res, next) {
  logger.info('START POST api/itemCollections/getCollectionsForItemType');
  try {
    ItemCollection.model.find({
      "itemType": req.body.itemType
    }, function(err, collections) {
      if(err) {
        logger.error('ERROR POST api/itemCollections/getCollectionsForItemType', {error: err, body: req.body});
        return next(err);
      }
      var retVal = {
        data: collections
      };
      logger.info('END POST api/itemCollections/getCollectionsForItemType');
      res.json(retVal);
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/itemCollections/getCollectionsForItemType', {error: error});
    next(error);
  }
});

/* get collections for itemTypes */
router.post('/getCollectionsForItemTypes', function(req, res, next) {
  logger.info('START POST api/itemCollections/getCollectionsForItemTypes');
  try {
    var typeConditions = [];
    for (var i = req.body.itemTypes.length - 1; i >= 0; i--) {
      typeConditions.push({itemType: req.body.itemTypes[i]});
    }
    ItemCollection.model.find().or(typeConditions).exec(function(err, collections) {
      if(err) {
        logger.error('ERROR POST api/itemCollections/getCollectionsForItemTypes', {error: err, body: req.body});
        return next(err);
      }
      var groupedCollections = underscore.groupBy(collections, function(collection) {
        return collection.itemType;
      });
      var retVal = {
        data: groupedCollections
      };
      logger.info('END POST api.itemCollections/getCollectionsForItemTypes');
      res.json(retVal);
    });
  } catch(error) {
    logger.error('ERROR - exception in POST api/itemCollections/getCollectionsForItemTypes', {error: error});
    next(error);
  }
});

module.exports = router;
