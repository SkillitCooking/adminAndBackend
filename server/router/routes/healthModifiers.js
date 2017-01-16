var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);

var logger = require('../../util/logger').serverLogger;
var mongoose = require('mongoose');
var db = require('../../database');
var HealthModifier = db.healthModifiers;
var Recipe = db.recipes;

/*Get all*/
router.get('/', function(req, res, next) {
  logger.info('START GET api/healthModifiers/');
  HealthModifier.model.find(function(err, modifiers) {
    if(err) {
      logger.error('ERROR GET api/healthModifiers/', {error: err});
      return next(err);
    }
    var retVal = {
      data: modifiers
    };
    res.json(retVal);
    logger.info('END GET api/healthModifiers');
  });
});

/*Put modifier*/
router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/dailyTips/' + req.params.id);
    req.body.healthModifier.dateModified = Date.parse(new Date().toUTCString());
    HealthModifier.model.findOneAndUpdate(req.params.id, req.body.healthModifier, {new: true, setDefaultsOnInsert: true}, function(err, modifier) {
      if(err) {
        logger.error('ERROR PUT api/healthModifiers/' + req.params.id);
        return next(err);
      }
      //adjust affected Recipes
      var recipeIds = [];
      Recipe.model.find({healthModifiers: {_id: modifier._id}}, function(err, recipes) {
        for (var i = recipes.length - 1; i >= 0; i--) {
          for (var j = recipes.healthModifiers.length - 1; j >= 0; j--) {
            if(recipes.healthModifiers[j]._id === modifier._id) {
              recipeIds.push(recipes[i]._id);
              recipes[i].healthModifiers[j] = modifier;
              recipes[i].markModified('healthModifiers');
              recipes[i].save(function(err, recipe, numAffected) {
                if(err) {
                  logger.error('ERROR PUT api/healthModifiers/:id in recipe save', {error: err});
                  return next(err);
                }
              });
            }
          }
        }
        logger.info('END PUT api/healthModifiers/' + req.params.id);
        res.json({data: modifier, affectedRecipeIds: recipeIds});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/healthModifiers/:id', {error: error});
    return next(error);
  }
});

router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/healthModifiers/' + req.params.id);
    HealthModifier.model.findByIdAndRemove(req.params.id, function(err, modifier) {
      //adjust Recipes
      Recipe.model.find({healthModifiers: {_id: modifier._id}}, function(err, recipes) {
        var recipeIds = [];
        for (var i = recipes.length - 1; i >= 0; i--) {
          for (var j = recipes[i].healthModifiers.length - 1; j >= 0; j--) {
            if(recipes[i].healthModifiers[j]._id == modifier._id) {
              recipeIds.push(recipes[i]._id);
              recipes[i].healthModifiers.splice(j, 1);
              recipes[i].markModified('healthModifiers');
              recipes[i].save(function(err, recipe, numAffected) {
                if(err) {
                  logger.error('ERROR DELETE api/healthModifiers/:id', {error: err});
                  return next(err);
                }
              });
            }
          }
        }
        logger.info('ERROR DELETE api/healthModifiers/:id', {error: err});
        res.json({data: modifier, affectedRecipeIds: recipeIds});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in DELETE api/healthModifiers/:id', {error: error});
    return next(error);
  }
});

/*post*/
router.post('/', function(req, res, next) {
  logger.info('START POST api/healthModifiers/');
  try {
    console.log('healthModifier: ', req.body.healthModifier);
    var query = {name: req.body.healthModifier.name};
    req.body.healthModifier.dateModified = Date.parse(new Date().toUTCString());
    HealthModifier.model.findOneAndUpdate(query, req.body.healthModifier, {upsert: true, setDefaultsOnInsert: true}, function(err, modifier) {
      if(err) {
        logger.error('ERROR POST api/healthModifiers/', {error: err});
        return next(err);
      }
      console.log('modifier', modifier);
      if(modifier === null) {
        //then inserted and need it to return
        HealthModifier.model.findOne({name: req.body.healthModifier.name}, function(err, modifier) {
          if(err) {
            logger.error('ERROR POST api/healthModifiers/', {error: err, body: req.body});
            return next(err);
          }
          console.log('mod', modifier);
          logger.info('END POST api/healthModifiers/');
          res.json({data: modifier});
        });
      } else {
        logger.info('END POST api/healthModifiers/');
        res.json({data: modifier});
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/healthModifiers/', {error: error});
    return next(error);
  }
});

/*get one*/
router.get('/:id', function(req, res, next) {
  try {
    logger.info('START GET api/healthModifiers/' + req.params.id);
    HealthModifier.model.findById(req.params.id, function(err, modifier) {
      if(err) {
        logger.error('ERROR GET api/healthModifiers/' + req.params.id);
        return next(err);
      }
      logger.info('END GET api/healthModifiers/' + req.params.id);
      res.json({data: modifier});
    });
  } catch (error) {
    logger.error('ERROR - exception in GET api/healthModifiers/:id', {error: error});
    return next(error);
  }
});

module.exports = router;