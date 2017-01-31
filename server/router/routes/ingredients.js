var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);


var logger = require('../../util/logger').serverLogger;
var constants = require('../../util/constants');

var mongoose = require('mongoose');
var underscore = require('underscore');
var db = require('../../database');
var Ingredient = db.ingredients;
var Recipe = db.recipes;
var User = db.users;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

/*router.get('/change', function(req, res, next) {
  Ingredient.model.update({}, {showInSelection: true}, {multi: true}, function(err, raw) {
    if(err) {
      console.log('update error', err);
      return next(err);
    }
    res.json({msg: raw});
  });
});*/

/* GET ingredients listing. */
router.get('/', function(req, res, next) {
  logger.info('START GET api/ingredients/');
  Ingredient.model.find(function (err, ingredients) {
    if(err) {
      logger.error('ERROR GET api/ingredients/', {error: err});
      return next(err);
    }
    logger.info('END GET api/ingredients/');
    res.json(ingredients);
  });
});

function createIngredientSets(ingredients) {
  var ingredientSets = underscore.groupBy(ingredients, "inputCategory");
  for (var key in ingredientSets) {
    ingredientSets[key] = underscore.groupBy(ingredientSets[key], 'inputSubCategory');
  }
  var retData = {
    data: ingredientSets
  };
  return retData;
}

/* GET getIngredientsForSelection legacy*/
/* Organizes ingredients by inputCategory*/
router.get('/getIngredientsForSelection', function(req, res, next) {
  logger.info('START GET api/ingredients/getIngredientsForSelection');
  Ingredient.model.find(function (err, ingredients) {
    if(err) {
      logger.error('ERROR GET api/ingredients/getIngredientsForSelection', {error: err});
      return next(err);
    }
    var ingredientSets = underscore.groupBy(ingredients, "inputCategory");
    for (var key in ingredientSets) {
      ingredientSets[key] = underscore.groupBy(ingredientSets[key], 'inputSubCategory');
      
    }
    var retData = {
      data: ingredientSets
    };
    logger.info('END GET api/ingredients/getIngredientsForSelection');
    res.json(retData);
  });
});

/* GET getIngredientsForSelection */
/* Organizes ingredients by inputCategory*/
router.post('/getIngredientsForSelection', function(req, res, next) {
  logger.info('START POST api/ingredients/getIngredientsForSelection');
  Ingredient.model.find({showInSelection: true}, function (err, ingredients) {
    if(err) {
      logger.error('ERROR POST api/ingredients/getIngredientsForSelection', {error: err});
      return next(err);
    }
    if(req.body.userId && req.body.userToken) {
      User.model.findById(req.body.userId, function(err, user) {
        if(err) {
          logger.error('ERROR POST api/ingredients/getIngredientsForSelection', {error: err});
          return next(err);
        }
        if(!user) {
          var error = {
            status: constants.STATUS_CODES.UNPROCESSABLE,
            message: 'No user for given id'
          };
          logger.error('ERROR POST api/ingredients/getIngredientsForSelection - no user found', {error: error});
          return next(error);
        }
        if(req.body.userToken !== user.curToken) {
          /*var error = {
            status: constants.STATUS_CODES.UNAUTHORIZED,
            message: 'Credentials for method are missing'
          };
          logger.error('ERROR POST api/ingredients/getIngredientsForSelection - token', {error: error, sentToken: req.body.userToken, currentToken: user.curToken});
          return next(error);*/
        }
        var outlawIngredients = [];
        for (var i = user.dietaryPreferences.length - 1; i >= 0; i--) {
          outlawIngredients = outlawIngredients.concat(user.dietaryPreferences[i].outlawIngredients);
        }
        ingredients = underscore.reject(ingredients, function(ingredient) {
          return underscore.contains(outlawIngredients, ingredient.name.standardForm);
        });
        var retData = createIngredientSets(ingredients);
        logger.info('END POST api/ingredients/getIngredientsForSelection');
        res.json(retData);
      });
    } else {
      var retData = createIngredientSets(ingredients);
      logger.info('END POST api/ingredients/getIngredientsForSelection');
      res.json(retData);
    }
  });
});

/* POST /ingredients */
/* Check for same ingredient name*/
router.post('/', function(req, res, next) {
  logger.info('START POST api/ingredients/');
  try {
    console.log('inger', req.body.ingredient);
    var query = {'name': req.body.ingredient.name};
    req.body.ingredient.dateModified = Date.parse(new Date().toUTCString());
    Ingredient.model.findOneAndUpdate(query, req.body.ingredient,
      {upsert: true, setDefaultsOnInsert: true}, function(err, ingredient) {
      if (err) {
        logger.error('ERROR POST api/ingredients/', {error: err, body: req.body});
        return next(err);
      }
      if(ingredient === null){
        //then inserted, and need it to return
        Ingredient.model.findOne({'name': req.body.ingredient.name},
          function(err, ingredient) {
            if(err) {
              logger.error('ERROR POST api/ingredients/', {error: err, body: req.body});

              return next(err);
            }
            logger.info('END POST api/ingredients/');
            res.json(ingredient);
          });
      } else {
        //then updated
        logger.info('END POST api/ingredients/');
        res.json(ingredient);
      }
    });
  } catch(error) {
    logger.error('ERROR - exception in POST api/ingredients/', {error: error});
    return next(error);
  }
});

/* GET /ingredients/id */
router.get('/:id', function(req, res, next) {
  try {
    logger.info('START GET api/ingredients/' + req.params.id);
    Ingredient.model.findById(req.params.id, function(err, ingredient) {
      if (err) {
        logger.error('ERROR GET api/ingredients/' + req.params.id, {error: err});
        return next(err);
      }
      logger.info('END GET api/ingredients/' + req.params.id);
      res.json(ingredient);
    });
  } catch (error) {
    logger.error('ERROR - exception in GET api/ingredients/:id', {error: error});
    return next(error);
  }
});

/* PUT /ingredients/:id */
router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/ingredients/' + req.params.id);
    req.body.ingredient.dateModified = Date.parse(new Date().toUTCString());
    Ingredient.model.findByIdAndUpdate(req.params.id, req.body.ingredient, {new: true, setDefaultsOnInsert: true}, function(err, ingredient) {
      if (err) {
        logger.error('ERROR PUT api/ingredients' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      //update Recipe references
      var recipeIds = [];
      Recipe.model.find({}, 'ingredientList _id', function(err, recipes) {
        if(err) {
          logger.error('ERROR PUT api/ingredients/' + req.params.id + ' in Recipe.model.find', {error: err, body: req.body, ingredientId: ingredient._id});
          return next(err);
        }
        for (var i = recipes.length - 1; i >= 0; i--) {
          var recipeChanged = false;
          for (var j = recipes[i].ingredientList.ingredientTypes.length - 1; j >= 0; j--) {
            var type = recipes[i].ingredientList.ingredientTypes[j];
            for (var k = type.ingredients.length - 1; k >= 0; k--) {
              if(ingredient._id.equals(type.ingredients[k]._id)) {
                //then need to update
                recipes[i].ingredientList.ingredientTypes[j].ingredients[k] = ingredient;
                recipes[i].markModified('ingredientList');
                recipeChanged = true;
              }
            }
          }
          if(recipeChanged) {
            recipes[i].dateModified = Date.parse(new Date().toUTCString());
            recipes[i].save(function(err, recipe, numAffected) {
              if(err) {
                logger.error('ERROR PUT api/ingredients/' + req.params.id + ' in Recipe.model.save', {error: err, body: req.body, ingredient: ingredient._id});
                return next(err);
              }
            });
            recipeIds.push(recipes[i]._id);
          }
        }
        logger.info('END PUT api/ingredients/' + req.params.id);
        res.json({data: ingredient, affectedRecipeIds: recipeIds});
      });    
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/ingredients/:id', {error: error});
    return next(error);
  }
});

/* DELETE /ingredients/:id */
router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/ingredients/' + req.params.id);
    Ingredient.model.findByIdAndRemove(req.params.id, function(err, ingredient) {
      if (err) {
        logger.error('ERROR DELETE api/ingredients/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      //update Recipe references
      var recipeIds = [];
      Recipe.model.find({}, 'ingredientList _id', function(err, recipes) {
        if(err) {
          logger.error('ERROR DELETE api/ingredients/' + req.params.id + ' in Recipe.model.find', {error: err, body: req.body, ingredient: ingredient._id});
          return next(err);
        }
        for (var i = recipes.length - 1; i >= 0; i--) {
          var recipeChanged = false;
          for (var j = recipes[i].ingredientList.ingredientTypes.length - 1; j >= 0; j--) {
            var type = recipes[i].ingredientList.ingredientTypes[j];
            for (var k = type.ingredients.length - 1; k >= 0; k--) {
              if(ingredient._id.equals(type.ingredients[k]._id)) {
                //then delete reference
                recipes[i].ingredientList.ingredientTypes[j].ingredients.splice(k, 1);
                recipes[i].markModified('ingredientList');
                recipeChanged = true;
              }
            }
          }
          if(recipeChanged) {
            recipes[i].dateModified = Date.parse(new Date().toUTCString());
            recipes[i].save(function(err, recipe, numAffected) {
              if(err) {
                logger.error('ERROR DELETE api/ingredients/' + req.params.id + ' in Recipe.model.save', {error: err, body: req.body, ingredientId: ingredient._id});
                return next(err);
              }
            });
            recipeIds.push(recipes[i]._id);
          }
        }
        logger.info('END DELETE api/ingredients/' + req.params.id);
        res.json({data: ingredient, affectedRecipeIds: recipeIds});
      }); 
    });
  } catch(error) {
    logger.error('ERROR - exception in DELETE api/ingredients/:id', {error: error});
    return next(error);
  }
});

module.exports = router;
