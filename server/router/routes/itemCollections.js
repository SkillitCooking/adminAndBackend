var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);

var logger = require('../../util/logger').serverLogger;
var constants = require('../../util/constants');

var mongoose = require('mongoose');
var underscore = require('underscore');
var db = require('../../database');
var ItemCollection = db.itemCollections;
var DailyTip = db.dailyTips;
var GlossaryEntry = db.glossaryEntries;
var HowToShopEntry = db.howToShopEntries;
var TrainingVideo = db.trainingVideos;
var Recipe = db.recipes;
var User = db.users;

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

router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/itemCollections/' + req.params.id);
    req.body.collection.dateModified = Date.parse(new Date().toUTCString());
    ItemCollection.model.findByIdAndUpdate(req.params.id, req.body.collection, {new: true, setDefaultsOnInsert:true}, function(err, collection) {
      if(err) {
        logger.error('ERROR PUT api/itemCollections/' + req.params.id, {error: err});
        return next(err);
      }
      logger.info('END PUT api/itemCollections/' + req.params.id);
      res.json({data: collection});
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/itemCollections/:id', {error: error});
    return next(error);
  }
});

router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/itemCollections/' + req.params.id);
    ItemCollection.model.findByIdAndRemove(req.params.id, function(err, collection) {
      if(err) {
        logger.error('ERROR DELETE api/itemCollections/' + req.params.id, {error: err});
        return next(err);
      }
      //update references
      switch(collection.itemType) {
        case "dailyTip":
          var tipIds = [];
          DailyTip.model.find({}, 'collectionIds _id', function(err, tips) {
            if(err) {
              logger.error('ERROR DELETE api/itemCollections/' + req.params.id + 'in DailyTip.model.find', {collectionId: collection._id});
              return next(err);
            }
            for (var i = tips.length - 1; i >= 0; i--) {
              var tipChanged = false;
              var collections = tips[i].collectionIds;
              for (var j = collections.length - 1; j >= 0; j--) {
                if(collection._id.equals(collections[j])) {
                  collections.splice(j, 1);
                  tipChanged = true;
                }
              }
              if(tipChanged) {
                tipIds.push(tips[i]._id);
                tips[i].dateModified = Date.parse(new Date().toUTCString());
                tips[i].save(function(err, tip, numAffected) {
                  if(err) {
                    logger.error('ERROR DELETE api/itemCollections/' + req.params.id + 'in DailyTip.model.save', {collectionId: collection._id});
                    return next(err);
                  }
                });
              }
            }
            logger.info('END DELETE api/itemCollections/' + req.params.id);
            res.json({data: collection, affectedIds: tipIds, type: 'tips'});
          });
          break;
        case "howToShop":
          var howToShopIds = [];
          HowToShopEntry.model.find({}, 'collectionIds _id', function(err, entries) {
            if(err) {
              logger.error('ERROR DELETE api/itemCollections/' + req.params.id + 'in HowToShopEntry.model.find', {collectionId: collection._id});
              return next(err);
            }
            for (var i = entries.length - 1; i >= 0; i--) {
              var entryChanged = false;
              var collections = entries[i].collectionIds;
              for (var j = collections.length - 1; j >= 0; j--) {
                if(collection._id.equals(collections[j])) {
                  collections.splice(j, 1);
                  entryChanged = true;
                }
              }
              if(entryChanged) {
                howToShopIds.push(entries[i]._id);
                entries[i].dateModified = Date.parse(new Date().toUTCString());
                entries[i].save(function(err, entry, numAffected) {
                  if(err) {
                    logger.error('ERROR DELETE api/itemCollections/' + req.params.id + 'in HowToShopEntry.model.save', {collectionId: collection._id});
                    return next(err);
                  }
                });
              }
            }
            logger.info('END DELETE api/itemCollections/' + req.params.id);
            res.json({data: collection, affectedIds: howToShopIds, type: 'howToShop'});
          });
          break;
        case "recipe":
          var recipeIds = [];
          Recipe.model.find({}, 'collectionIds _id', function(err, recipes) {
            if(err) {
              logger.error('ERROR DELETE api/itemCollections/' + req.params.id + 'in Recipe.model.find', {collectionId: collection._id});
              return next(err);
            }
            for (var i = recipes.length - 1; i >= 0; i--) {
              var recipeChanged = false;
              var collections = recipes[i].collectionIds;
              for (var j = collections.length - 1; j >= 0; j--) {
                if(collection._id.equals(collections[j])) {
                  collections.splice(j, 1);
                  recipeChanged = true;
                }
              }
              if(recipeChanged) {
                recipeIds.push(recipes[i]._id);
                recipes[i].dateModified = Date.parse(new Date().toUTCString());
                recipes[i].save(function(err, recipe, numAffected) {
                  if(err) {
                    logger.error('ERROR DELETE api/itemCollections/' + req.params.id + 'in Recipe.model.save', {collectionId: collection._id});
                    return next(err);
                  }
                });
              }
            }
            logger.info('END DELETE api/itemCollections/' + req.params.id);
            res.json({data: collection, affectedIds: recipeIds, type: 'recipe'});
          });
          break;
        case "glossary":
          var glossaryIds = [];
          GlossaryEntry.model.find({}, 'collectionIds _id', function(err, entries) {
            if(err) {
              logger.error('ERROR DELETE api/itemCollections/' + req.params.id + 'in GlossaryEntry.model.find', {collectionId: collection._id});
              return next(err);
            }
            for (var i = entries.length - 1; i >= 0; i--) {
              var entryChanged = false;
              var collections = entries[i].collectionIds;
              for (var j = collections.length - 1; j >= 0; j--) {
                if(collection._id.equals(collections[j])) {
                  collections.splice(j, 1);
                  entryChanged = true;
                }
              }
              if(entryChanged) {
                glossaryIds.push(entries[i]._id);
                entries[i].dateModified = Date.parse(new Date().toUTCString());
                entries[i].save(function(err, entry, numAffected) {
                  if(err) {
                    logger.error('ERROR DELETE api/itemCollections/' + req.params.id + 'in GlossaryEntry.model.save', {collectionId: collection._id});
                    return next(err);
                  }
                });
              }
            }
            logger.info('END DELETE api/itemCollections/' + req.params.id);
            res.json({data: collection, affectedIds: glossaryIds, type: 'glossary'});
          });
          break;
        case "trainingVideo":
          var videoIds = [];
          TrainingVideo.model.find({}, 'collectionIds _id', function(err, videos) {
            if(err) {
              logger.error('ERROR DELETE api/itemCollections/' + req.params.id + 'in TrainingVideo.model.find', {collectionId: collection._id});
              return next(err);
            }
            for (var i = videos.length - 1; i >= 0; i--) {
              var videoChanged = false;
              var collections = videos[i].collectionIds;
              for (var j = collections.length - 1; j >= 0; j--) {
                if(collection._id.equals(collections[j])) {
                  collections.splice(j, 1);
                  videoChanged = true;
                }
              }
              if(videoChanged) {
                videoIds.push(videos[i]._id);
                videos[i].dateModified = Date.parse(new Date().toUTCString());
                videos[i].save(function(err, video, numAffected) {
                  if(err) {
                    logger.error('ERROR DELETE api/itemCollections/' + req.params.id + 'in TrainingVideo.model.save', {collectionId: collection._id});
                    return next(err);
                  }
                });
              }
            }
            logger.info('END DELETE api/itemCollections/' + req.params.id);
            res.json({data: collection, affectedIds: videoIds, type: 'videos'});
          });
          break;
        default:
          logger.info('END DELETE api/itemCollections/' + req.params.id);
          res.json({data: collection});
          break;
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/itemCollections/:id', {error: error});
    return next(error);
  }
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
    req.body.dateModified = Date.parse(new Date().toUTCString());
    ItemCollection.model.findOneAndUpdate(query, req.body.itemCollection, {upsert: true, setDefaultsOnInsert: true}, function(err, collection) {
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
    return next(error);
  }
});

/* get collections for itemType */
router.post('/getCollectionsForItemType', function(req, res, next) {
  logger.info('START POST api/itemCollections/getCollectionsForItemType');
  try {
    if(req.body.itemType && req.body.userId && req.body.userToken) {
      User.model.findById(req.body.userId, function(err, user) {
        if(err) {
          logger.error('ERROR POST api/itemCollections/getCollectionsForItemType - user', {error: err});
          return next(err);
        }
        if(!user) {
          var error = {
            status: constants.STATUS_CODES.UNPROCESSABLE,
            message: 'No user for given id'
          };
          logger.error('ERROR POST api/itemCollections/getCollectionsForItemType - no user found', {error: error});
          return next(error);
        }
        if(req.body.userToken !== user.curToken) {
          /*var error = {
            status: constants.STATUS_CODES.UNAUTHORIZED,
            message: 'Credentials for method are missing'
          };
          logger.error('ERROR POST api/itemCollections/getCollectionsForItemType - token', {error: error});
          return next(error);*/
        }
        var dietaryPreferenceIds = [];
        for (var i = user.dietaryPreferences.length - 1; i >= 0; i--) {
          dietaryPreferenceIds.push(user.dietaryPreferences[i]._id);
        }
        ItemCollection.model.find({
          "dietaryPreferenceIds": {
            "$nin": dietaryPreferenceIds
          },
          "itemType": req.body.itemType
        }, function(err, collections) {
          if(err) {
            logger.error('ERROR POST api/itemCollections/getCollectionsForItemType', {error: err});
            return next(err);
          }
          var retVal = {
            data: collections
          };
          logger.info('END POST api/itemCollections/getCollectionsForItemType');
          res.json(retVal);
        });
      });
    } else {
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
    }
  } catch (error) {
    logger.error('ERROR - exception in POST api/itemCollections/getCollectionsForItemType', {error: error});
    return next(error);
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
    return next(error);
  }
});

module.exports = router;
