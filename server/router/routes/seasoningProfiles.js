var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);

var logger = require('../../util/logger').serverLogger;
var mailingService = require('../lib/mailingService');

var mongoose = require('mongoose');
var db = require('../../database');
var SeasoningProfile = db.seasoningProfiles;
var Recipe = db.recipes;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */


/* GET seasoningProfiles listing. */
router.get('/', function(req, res, next) {
  logger.info('START GET api/seasoningProfiles/');
  SeasoningProfile.model.find(function (err, profiles) {
    if(err) {
      logger.error('ERROR GET api/seasoningProfiles/', {error: err});
      mailingService.mailServerError({error: err, location: 'GET api/seasoningProfiles/'});
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
    req.body.seasoningProfile.dateModified = Date.parse(new Date().toUTCString());
    SeasoningProfile.model.findOneAndUpdate(query, 
      req.body.seasoningProfile, {upsert: true, setDefaultsOnInsert: true}, 
      function(err, profile) {
        if (err) {
          logger.error('ERROR POST api/seasoningProfiles/', {error: err, body: req.body});
          mailingService.mailServerError({error: err, location: 'POST api/seasoningProfiles/'});
          return next(err);
        }
        if(profile === null) {
          //then inserted, and need it to return
          SeasoningProfile.model.findOne(query, function(err, profile) {
            if(err) {
              logger.error('ERROR POST api/seasoningProfiles/', {error: err, body: req.body});
              mailingService.mailServerError({error: err, location: 'POST api/seasoningProfiles/'});
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
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/seasoningProfiles/'});
    return next(error);
  }
});

/* GET /seasoningProfiles/id */
router.get('/:id', function(req, res, next) {
  try {
    logger.info('START GET api/seasoningProfiles/' + req.params.id);
    SeasoningProfile.model.findById(req.params.id, function(err, profile) {
      if (err) {
        logger.error('ERROR GET api/seasoningProfiles/' + req.params.id, {error: err, body: req.body});
        mailingService.mailServerError({error: err, location: 'GET api/seasoningProfiles/' + req.params.id});
        return next(err);
      }
      logger.info('END GET api/seasoningProfiles/' + req.params.id);
      res.json(profile);
    });
  } catch (error) {
    logger.error('ERROR - exception in GET api/seasoningProfiles/:id', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION GET api/seasoningProfiles/:id'});
    return next(error);
  }
});

/* PUT /seasoningProfiles/:id */
router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/seasoningProfiles/' + req.params.id);
    req.body.seasoningProfile.dateModified = Date.parse(new Date().toUTCString());
    SeasoningProfile.model.findByIdAndUpdate(req.params.id, req.body.seasoningProfile, {new: true, setDefaultsOnInsert: true}, function(err, profile) {
      if (err) {
        logger.error('ERROR PUT api/seasoningProfiles/' + req.params.id, {error: err, body: req.body});
        mailingService.mailServerError({error: err, location: 'PUT api/seasoningProfiles/' + req.params.id});
        return next(err);
      }
      //update recipe references
      var recipeIds = [];
      Recipe.model.find({}, 'defaultSeasoningProfile choiceSeasoningProfiles _id', function(err, recipes) {
        if(err) {
          logger.error('ERROR PUT api/seasoningProfiles/' + req.params.id + ' in Recipe.model.find', {error: err, body: req.body, profileId: profile._id});
          mailingService.mailServerError({error: err, location: 'PUT api/seasoningProfiles/' + req.params.id, extra: 'Recipe.find'});
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
            recipes[i].dateModified = Date.parse(new Date().toUTCString());
            recipes[i].save(function(err, recipe, numAffected) {
              if(err) {
                logger.error('ERROR PUT api/seasoningProfiles/' + req.params.id + ' in Recipe.model.save', {error: err, body: req.body, profileId: profile._id});
                mailingService.mailServerError({error: err, location: 'PUT api/seasoningProfiles/' + req.params.id, extra: 'Recipe.save'});
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
    mailingService.mailServerError({error: error, location: 'EXCEPTION PUT api/seasoningProfiles/:id'});
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
        mailingService.mailServerError({error: err, location: 'DELETE api/seasoningProfiles/' + req.params.id});
        return next(err);
      }
      //update recipe references
      var recipeIds = [];
      Recipe.model.find({}, 'defaultSeasoningProfile choiceSeasoningProfiles _id', function(err, recipes) {
        if(err) {
          logger.error('ERROR DELETE api/seasoningProfiles/' + req.params.id + ' in Recipe.model.find', {error: err, body: req.body, profileId: profile._id});
          mailingService.mailServerError({error: err, location: 'DELETE api/seasoningProfiles/' + req.params.id, extra: 'Recipe.find'});
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
            recipes[i].dateModified = Date.parse(new Date().toUTCString());
            recipes[i].save(function(err, recipe, numAffected) {
              if(err) {
                logger.error('ERROR DELETE api/seasoningProfiles/' + req.params.id + ' in Recipe.model.save', {error: err, body: req.body, profileId: profile._id});
                mailingService.mailServerError({error: err, location: 'DELETE api/seasoningProfiles/' + req.params.id, extra: 'Recipe.save'});
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
    mailingService.mailServerError({error: error, location: 'DELETE api/seasoningProfiles/:id'});
    return next(error);
  }
});

module.exports = router;
