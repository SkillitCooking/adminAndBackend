var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var underscore = require('underscore');
var db = require('../../database');
var ItemCollection = db.itemCollections;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

/* GET all itemCollections - organize by type */
router.get('/', function(req, res, next) {
  ItemCollection.model.find(function(err, collections) {
    if(err) return next(err);
    var typedCollections = underscore.groupBy(collections, "itemType");
    var retData = {
      data: typedCollections
    };
    res.json(retData);
  });
});

/* POST */
/* checks for same collection name of given itemType */
router.post('/', function(req, res, next) {
  var query = {
    'name': req.body.itemCollection.name,
    'itemType': req.body.itemCollection.itemType
  };
  ItemCollection.model.findOneAndUpdate(query, req.body.itemCollection, {upsert: true}, function(err, collection) {
    if(err) return next(err);
    if(collection === null) {
      //then inserted, and need to return it
      ItemCollection.model.findOne(query, function(err, collection) {
        if(err) return next(err);
        var retVal = {
          data: collection
        };
        res.json(retVal);
      });
    } else {
      //then updated
      retVal = {
        data: collection
      };
      res.json(retVal);
    }
  });
});

/* get collections for itemType */
router.post('/getCollectionsForItemType', function(req, res, next) {
  ItemCollection.model.find({
    "itemType": req.body.itemType
  }, function(err, collections) {
    if(err) return next(err);
    var retVal = {
      data: collections
    };
    res.json(retVal);
  });
});

/* get collections for itemTypes */
router.post('/getCollectionsForItemTypes', function(req, res, next) {
  var typeConditions = [];
  for (var i = req.body.itemTypes.length - 1; i >= 0; i--) {
    typeConditions.push({itemType: req.body.itemTypes[i]});
  }
  ItemCollection.model.find().or(typeConditions).exec(function(err, collections) {
    var groupedCollections = underscore.groupBy(collections, function(collection) {
      return collection.itemType;
    });
    var retVal = {
      data: groupedCollections
    };
    res.json(retVal);
  });
});

module.exports = router;
