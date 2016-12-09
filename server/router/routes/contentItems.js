var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);

var logger = require('../../util/logger').serverLogger;
var underscore = require('underscore');
var constants = require('../../util/constants');

var mongoose = require('mongoose');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

var db = require('../../database');
var DailyTip = db.dailyTips;
var GlossaryEntry = db.glossaryEntries;
var HowToShopEntry = db.howToShopEntries;
var TrainingVideo = db.trainingVideos;

router.post('/getItemsWithTypesAndIds', function(req, res, next) {
  logger.info('START POST api/contentItems/getItemsWithTypesAndIds');
  try {
    //don't mutate req.body.items - this is order preserving
    //first, divide on basis of type
    //map req.body.items for ids for each - find for given type with that mapped array
    //when all found, order using req.body.items
    var groupedItems = underscore.groupBy(req.body.items, function(item) {
      return item.type;
    });
    var mappingFunction = function(item) {
      return item.id;
    };
    for (var key in groupedItems) {
      groupedItems[key] = groupedItems[key].map(mappingFunction);
    }
    //how to properly call all of them - so that I can have access to all of the return items without having to nest them?
    Promise.props({
      tips: DailyTip.model.find({'_id': {$in: groupedItems[constants.ITEM_TYPES.TIP]}}).execAsync(),
      glossary: GlossaryEntry.model.find({'_id': {$in: groupedItems[constants.ITEM_TYPES.GLOSSARY]}}).execAsync(),
      howToShop: HowToShopEntry.model.find({'_id': {$in: groupedItems[constants.ITEM_TYPES.HOWTOSHOP]}}).execAsync(),
      trainingVideo: TrainingVideo.model.find({'_id': {$in: groupedItems[constants.ITEM_TYPES.TRAININGVIDEO]}}).execAsync()
    }).then(function(results) {
      logger.info('END POST api/contentItems/getItemsWithTypesAndIds')
      res.json({data: results});
    }).catch(function(err) {
      logger.error('ERROR POST api/contentItems/getItemsWithTypesAndIds', {error: err, body: req.body});
      return next(err);
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/contentItems/getItemsWithTypesAndIds', {error: error});
    return next(error);
  }
});

module.exports = router;