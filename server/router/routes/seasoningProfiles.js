var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var SeasoningProfile = db.seasoningProfiles;
var Recipe = db.recipes;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

router.get('/addDefault', function(req, res, next) {
  SeasoningProfile.model.findOne('572c58ea23731e97a70c5fa4', function(err, profile) {
    if(err)
      return next(err);
    Recipe.model.find(function(err, recipes) {
      if(err)
        return next(err);
      for (var i = recipes.length - 1; i >= 0; i--) {
        if(!recipes[i].defaultSeasoningProfile) {
          recipes[i].defaultSeasoningProfile = profile;
          recipes[i].save(function(err, recipe, numAffected) {
            if(err) return next(err);
          });
        }
      }
      res.json({success: 'yep'});
    });
  });
});

/* GET seasoningProfiles listing. */
router.get('/', function(req, res, next) {
  logger.info('START GET api/seasoningProfiles/');
  SeasoningProfile.model.find(function (err, profiles) {
    if(err) {
      logger.error('ERROR GET api/seasoningProfiles/', {error: err});
      return next(err);
    }
    var retVal = {
      data: profiles
    };
    logger.info('END GET api/seasoningProfiles/');
    res.json(retVal);
  });
});

/* POST /seasoningProfiles */
router.post('/', function(req, res, next) {
  logger.info('START POST api/seasoningProfiles/');
  try {
    var query = {'name': req.body.seasoningProfile.name};
    SeasoningProfile.model.findOneAndUpdate(query, 
      req.body.seasoningProfile, {upsert: true}, 
      function(err, profile) {
        if (err) {
          logger.error('ERROR POST api/seasoningProfiles/', {error: err, body: req.body});
          return next(err);
        }
        if(profile === null) {
          //then inserted, and need it to return
          SeasoningProfile.model.findOne(query, function(err, profile) {
            if(err) {
              logger.error('ERROR POST api/seasoningProfiles/', {error: err, body: req.body});
              return next(err);
            }
            logger.info('END POST api/seasoningProfiles/');
            res.json(profile);
          });
        } else {
          //then updated
          logger.info('END POST api/seasoningProfiles/');
          res.json(profile);
        }
    });
  } catch(error) {
    logger.error('ERROR - exception in POST api/seasoningProfiles/', {error: error});
    return next(error);
  }
});

/* GET /seasoningProfiles/id */
router.get('/:id', function(req, res, next) {
  try {
    logger.info('START GET api/seasoningProfiles/' + req.params.id);
    SeasoningProfile.model.findById(req.params.id, function(err, profile) {
      if (err) {
        logger.error('ERROR POST api/seasoningProfiles/', {error: err, body: req.body});
        return next(err);
      }
      logger.info('END GET api/seasoningProfiles/' + req.params.id);
      res.json(profile);
    });
  } catch (error) {
    logger.error('ERROR - exception in GET api/seasoningProfiles/:id', {error: error});
    return next(error);
  }
});

/* PUT /seasoningProfiles/:id */
router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/seasoningProfiles/' + req.params.id);
    SeasoningProfile.model.findByIdAndUpdate(req.params.id, req.body.seasoningProfile, {new: true}, function(err, profile) {
      if (err) {
        logger.error('ERROR PUT api/seasoningProfiles/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      //update recipe references
      var recipeIds = [];
      Recipe.model.find({}, 'defaultSeasoningProfile choiceSeasoningProfiles _id', function(err, recipes) {
        if(err) {
          logger.error('ERROR PUT api/seasoningProfiles/' + req.params.id + ' in Recipe.model.find', {error: err, body: req.body, profileId: profile._id});
          return next(err);
        }
        for (var i = recipes.length - 1; i >= 0; i--) {
          var recipeChanged = false;
          if(profile._id.equals(recipes[i].defaultSeasoningProfile._id)) {
            recipes[i].defaultSeasoningProfile = profile;
            recipeChanged = true;
          }
          for (var j = recipes[i].choiceSeasoningProfiles.length - 1; j >= 0; j--) {
            if(profile._id.equals(recipes[i].choiceSeasoningProfiles[j]._id)) {
              recipes[i].choiceSeasoningProfiles[j] = profile;
              recipes[i].markModified('choiceSeasoningProfiles');
              recipeChanged = true;
            }
          }
          if(recipeChanged) {
            recipes[i].save(function(err, recipe, numAffected) {
              if(err) {
                logger.error('ERROR PUT api/seasoningProfiles/' + req.params.id + ' in Recipe.model.save', {error: err, body: req.body, profileId: profile._id});
                return next(err);
              }
            });
            recipeIds.push(recipes[i]._id);
          }
        }
        logger.info('END PUT api/seasoningProfiles/' + req.params.id);
        res.json({data: profile, affectedRecipeIds: recipeIds});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/seasoningProfiles/:id', {error: error});
    return next(error);
  }
});

/* DELETE /seasoningProfiles/:id */
router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/seasoningProfiles/' + req.params.id);
    SeasoningProfile.model.findByIdAndRemove(req.params.id, function(err, profile) {
      if (err) {
        logger.error('ERROR DELETE api/seasoningProfiles/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      //update recipe references
      var recipeIds = [];
      Recipe.model.find({}, 'defaultSeasoningProfile choiceSeasoningProfiles _id', function(err, recipes) {
        if(err) {
          logger.error('ERROR DELETE api/seasoningProfiles/' + req.params.id + ' in Recipe.model.find', {error: err, body: req.body, profileId: profile._id});
          return next(err);
        }
        for (var i = recipes.length - 1; i >= 0; i--) {
          var recipeChanged = false;
          if(profile._id.equals(recipes[i].defaultSeasoningProfile._id)) {
            recipes[i].defaultSeasoningProfile = undefined;
            recipeChanged = true;
          }
          for (var j = recipes[i].choiceSeasoningProfiles.length - 1; j >= 0; j--) {
            if(profile._id.equals(recipes[i].choiceSeasoningProfiles[j]._id)) {
              recipes[i].choiceSeasoningProfiles.splice(j, 1);
              recipes[i].markModified('choiceSeasoningProfiles');
              recipeChanged = true;
            }
          }
          if(recipeChanged) {
            recipes[i].save(function(err, recipe, numAffected) {
              if(err) {
                logger.error('ERROR DELETE api/seasoningProfiles/' + req.params.id + ' in Recipe.model.save', {error: err, body: req.body, profileId: profile._id});
                return next(err);
              }
            });
            recipeIds.push(recipes[i]._id);
          }
        }
        logger.info('END DELETE api/seasoningProfiles/' + req.params.id);
        res.json({data: profile, affectedRecipeIds: recipeIds});
      });
    });
  } catch(error) {
    logger.error('ERROR - exception in DELETE api/seasoningProfiles/:id', {error: error});
    return next(error);
  }
});

module.exports = router;
