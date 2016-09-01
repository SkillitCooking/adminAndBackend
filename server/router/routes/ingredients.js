var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var underscore = require('underscore');
var db = require('../../database');
var Ingredient = db.ingredients;
var Recipe = db.recipes;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

router.get('/adjust', function(req, res, next) {
  Ingredient.model.find(function(err, ingredients) {
    for (var i = ingredients.length - 1; i >= 0; i--) {
      if(err) {
        return next(err);
      }
      var standardForm = ingredients[i].name.standardName;
      var nameObj = {
        standardForm: standardForm,
        singularForm: "",
        pluralForm: ""
      };
      ingredients[i].name = nameObj;
      ingredients[i].save(function(err, ingredient, numAffected) {
        if(err) {
          return next(err);
        }
      });
    }
    res.json({message: 'success'});
  });
});

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

/* GET getIngredientsForSelection */
/* Organizes ingredients by inputCategory*/
router.get('/getIngredientsForSelection', function(req, res, next) {
  logger.info('START GET api/ingredients/getIngredientsForSelection');
  Ingredient.model.find(function (err, ingredients) {
    if(err) {
      logger.error('ERROR GET api/ingredients/getIngredientsForSelection', {error: err});
      return next(err);
    }
    var ingredientSets = underscore.groupBy(ingredients, "inputCategory");
    var retData = {
      data: ingredientSets
    };
    logger.info('END GET api/ingredients/getIngredientsForSelection');
    res.json(retData);
  });
});

/* POST /ingredients */
/* Check for same ingredient name*/
router.post('/', function(req, res, next) {
  logger.info('START POST api/ingredients/');
  try {
    var query = {'name': req.body.ingredient.name};
    Ingredient.model.findOneAndUpdate(query, req.body.ingredient,
      {upsert: true}, function(err, ingredient) {
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
    Ingredient.model.findByIdAndUpdate(req.params.id, req.body.ingredient, {new: true}, function(err, ingredient) {
      if (err) {
        logger.error('ERROR PUT api/ingredients' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      //update Recipe references
      var recipeIds = [];
      Recipe.model.find({}, 'ingredientList.ingredientTypes _id', function(err, recipes) {
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
      Recipe.model.find({}, 'ingredientList.ingredientTypes _id', function(err, recipes) {
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
