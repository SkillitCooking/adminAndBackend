var express = require('express');
var router = express.Router();
var underscore = require('underscore');

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var Dish = db.dishes;
var Recipe = db.recipes;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

/* GET dishes listing */
router.get('/', function(req, res, next) {
  logger.info('START GET api/dishes/');
  Dish.model.find(function (err, dishes) {
    if(err) {
      logger.error('ERROR GET api/dishes/', {error: err});
      return next(err);
    }
    logger.info('END GET api/dishes/');
    res.json(dishes);
  });
});

/* POST /dishes */
/* check for same dish name */
router.post('/', function(req, res, next) {
  logger.info('START POST api/dishes/');
  console.log('here');
  try{
    var query = {'name': req.body.dish.name};
    req.body.dish.dateModified = Date.parse(new Date().toUTCString());
    console.log('dish', req.body.dish);
    Dish.model.findOneAndUpdate(query, req.body.dish, {upsert: true, setDefaultsOnInsert: true},function(err, dish) {
      if (err) {
        console.log('err', err);
        logger.error('ERROR POST api/dishes/', {error: err, body: req.body});
        return next(err);
      }
      console.log('there', dish);
      if(dish === null){
        //then inserted, and need it to return
        Dish.model.findOne({'name': req.body.dish.name}, function(err, dish) {
          if(err) {
            console.log('err2', err);
            logger.error('ERROR POST api/dishes/', {error: err, body: req.body});
            return next(err);
          }
          console.log('dish', dish);
          logger.info('END POST api/dishes/');
          res.json(dish);
        });
      } else {
        //then updated
        logger.info('END POST api/dishes/');
        res.json(dish);
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/dishes/', {error: error});
    return next(error);
  }
});

/* GET /dishes/:id */
router.get('/:id', function(req, res, next) {
  try {
    logger.info('START GET api/dishes/' + req.params.id);
    Dish.model.findById(req.params.id, function(err, dish) {
      if (err) {
        logger.error('ERROR GET api/dishes/' + req.params.id, {error: err});
        return next(err);
      }
      logger.info('START GET api/dishes/' + req.params.id);
      res.json(dish);
    });
  } catch (error) {
    logger.error('ERROR - exception in GET api/dishes/:id', {error: error});
    return next(error);
  }
});

/* PUT /dishes/:id */
router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/dishes/' + req.params.id);
    req.body.dish.dateModified = Date.parse(new Date().toUTCString());
    Dish.model.findByIdAndUpdate(req.params.id, req.body.dish, 
      {new: true, setDefaultsOnInsert: true}, function(err, dish) {
      if (err) {
        logger.error('ERROR PUT api/dishes/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      //update applicable recipes... careful of payload, though - just get ingredientList.equipmentNeeded
      var recipeIds = [];
      Recipe.model.find({}, 'ingredientList _id', function(err, recipes) {
        if(err) {
          logger.error('ERROR PUT api/dishes/' + req.params.id + ' in Recipe.model.find', {error: err, body: req.body, dishId: dish._id});
          return next(err);
        }
        for (var i = recipes.length - 1; i >= 0; i--) {
          var recipeChanged = false;
          for (var j = recipes[i].ingredientList.equipmentNeeded.length - 1; j >= 0; j--) {
            var dishPiece = recipes[i].ingredientList.equipmentNeeded[j];
            if(dish._id.equals(dishPiece._id)) {
              //then need to update dishPiece
              recipes[i].ingredientList.equipmentNeeded[j] = dish;
              recipes[i].markModified('ingredientList');
              recipeChanged = true;
            }
          }
          if(recipeChanged) {
            recipes[i].dateModified = Date.parse(new Date().toUTCString());
            recipes[i].save(function(err, recipe, numAffected) {
              if(err) {
                logger.error('ERROR PUT api/dishes/' + req.params.id + ' in Recipe.model.save', {error: err, body: req.body, dishId: dish._id});
                return next(err);
              }
            });
            recipeIds.push(recipes[i]._id);
          }
        }
        logger.info('END PUT api/dishes/' + req.params.id);
        res.json({data: dish, affectedRecipeIds: recipeIds});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/dishes/:id', {error: error});
    return next(error);
  }
});

/* DELETE /dishes/:id */
router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/dishes/' + req.params.id);
    Dish.model.findByIdAndRemove(req.params.id, function(err, dish) {
      if (err) {
        logger.error('ERROR DELETE api/dishes/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      //propagate to recipes
      var recipeIds = [];
      Recipe.model.find({}, 'ingredientList _id', function(err, recipes) {
        if(err) {
          logger.error('ERROR DELETE api/dishes/' + req.params.id + ' in Recipe.model.find', {error: err, body: req.body, dishId: dish._id});
          return next(err);
        }
        for (var i = recipes.length - 1; i >= 0; i--) {
          var recipeChanged = false;
          for (var j = recipes[i].ingredientList.equipmentNeeded.length - 1; j >= 0; j--) {
            var dishPiece = recipes[i].ingredientList.equipmentNeeded[j];
            if(dish._id.equals(dishPiece._id)) {
              //then need to update dishPiece
              recipes[i].ingredientList.equipmentNeeded.splice(j, 1);
              recipes[i].markModified('ingredientList');
              recipeChanged = true;
            }
          }
          if(recipeChanged) {
            recipes[i].dateModified = Date.parse(new Date().toUTCString());
            recipes[i].save(function(err, recipe, numAffected) {
              if(err) {
                logger.error('ERROR DELETE api/dishes/' + req.params.id + ' in Recipe.model.save', {error: err, body: req.body, dishId: dish._id});
                return next(err);
              }
            });
            recipeIds.push(recipes[i]._id);
          }
        }
        logger.info('END DELETE api/dishes/' + req.params.id);
        res.json({data: dish, affectedRecipeIds: recipeIds});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in DELETE api/dishes/:id', {error: error});
    return next(error);
  }
});

module.exports = router;