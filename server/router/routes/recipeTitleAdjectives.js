var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);

var logger = require('../../util/logger').serverLogger;
var mongoose = require('mongoose');
var db = require('../../database');
var RecipeTitleAdjective = db.recipeTitleAdjectives;
var Recipe = db.recipes;

/*Get all*/
router.get('/', function(req, res, next) {
  logger.info('START GET api/recipeTitleAdjectives/');
  RecipeTitleAdjective.model.find(function(err, adjectives) {
    if(err) {
      logger.error('ERROR GET api/recipeTitleAdjectives/', {error: err});
      return next(err);
    }
    res.json({data: adjectives});
    logger.info('END GET api/recipeTitleAdjectives');
  });
});

/*Put*/
router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/recipeTitleAdjectives/' + req.params.id);
    req.body.recipeTitleAdjective.dateModified = Date.parse(new Date().toUTCString());
    RecipeTitleAdjective.model.findOneAndUpdate(req.params.id, req.body.recipeTitleAdjective, {new: true, setDefaultsOnInsert: true}, function(err, adjective) {
      if(err) {
        logger.error('ERROR PUT api/recipeTitleAdjectives/' + req.params.id);
        return next(err);
      }
      //adjust affected Recipes
      var recipeIds = [];
      Recipe.model.find({titleAdjectives: {_id: adjective._id}}, function(err, recipes) {
        for (var i = recipes.length - 1; i >= 0; i--) {
          for (var j = recipes[i].titleAdjectives.length - 1; j >= 0; j--) {
            if(recipes[i].titleAdjectives[j]._id === adjective._id) {
              //then modify
              recipeIds.push(recipes[i]._id);
              recipes[i].adjectives[j] = adjective;
              recipes[i].markModified('titleAdjectives');
              recipes[i].save(function(err, recipe, numAffected) {
                if(err) {
                  logger.error('ERROR PUT api/recipeTitleAdjectives/:id in recipe save', {error: err});
                  return next(err);
                }
              });
            }
          }
        }
        logger.info('END PUT api/recipeTitleAdjectives' + req.params.id);
        res.json({data: adjective, affectedRecipeIds: recipeIds});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/recipeTitleAdjectives/:id', {error: error});
    return next(error);
  }
});

/*Delete*/
router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/recipeTitleAdjectives/' + req.params.id);
    RecipeTitleAdjective.model.findByIdAndRemove(req.params.id, function(err, adjective) {
      //adjust recipes
      Recipe.model.find({recipeTitleAdjectives: {_id: modifier._id}}, function(err, recipes) {
        var recipeIds = [];
        for (var i = recipes.length - 1; i >= 0; i--) {
          for (var j = recipes[i].titleAdjectives.length - 1; j >= 0; j--) {
            if(recipes[i].titleAdjectives[j]._id === adjective._id) {
              recipeIds.push(recipes[i]._id);
              recipes[i].titleAdjectives.splice(j, 1);
              recipes[i].markModified('titleAdjectives');
              recipes[i].save(function(err, recipe, numAffected) {
                if(err) {
                  logger.error('ERROR DELETE api/recipeTitleAdjectives/:id', {error: err});
                  return next(err);
                }
              });
            }
          }
        }
        logger.info('ERROR DELETE api/recipeTitleAdjectives/:id', {error: err});
        res.json({data: adjective, affectedRecipeIds: recipeIds});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in DELETE api/recipeTitleAdjectives/:id', {error: error});
    return next(error);
  }
});

/*Post*/
router.post('/', function(req, res, next) {
  logger.info('START POST api/recipeTitleAdjectives/');
  try {
    var query = {'name': req.body.recipeTitleAdjective.name};
    req.body.recipeTitleAdjective.dateModified = Date.parse(new Date().toUTCString());
    RecipeTitleAdjective.model.findOneAndUpdate(query, req.body.recipeTitleAdjective, {upsert: true, setDefaultsOnInsert: true}, function(err, adjective) {
      if(err) {
        logger.error('ERROR POST api/recipeTitleAdjectives/', {error: err});
        return next(err);
      }
      if(adjective === null) {
        //then inserted and need it to return
        RecipeTitleAdjective.model.findOne(query, function(err, modifier) {
          if(err) {
            logger.error('ERROR POST api/recipeTitleAdjectives/', {error: err, body: req.body});
            return next(err);
          }
          logger.info('END POST api/recipeTitleAdjectives/');
          res.json({data: adjective});
        });
      } else {
        logger.info('END POST api/recipeTitleAdjectives/');
        res.json({data: adjective});
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/recipeTitleAdjectives/', {error: error});
    return next(error);
  }
});

/*get one*/
router.get('/:id', function(req, res, next) {
  try {
    logger.info('START GET api/recipeTitleAdjectives/' + req.params.id);
    RecipeTitleAdjective.model.findById(req.params.id, function(err, adjective) {
      if(err) {
        logger.error('ERROR GET api/recipeTitleAdjectives/' + req.params.id);
        return next(err);
      }
      logger.info('END GET api/recipeTitleAdjectives/' + req.params.id);
      res.json({data: adjective});
    });
  } catch (error) {
    logger.error('ERROR - exception in GET api/recipeTitleAdjectives/:id', {error: error});
    return next(error);
  }
});

module.exports = router;