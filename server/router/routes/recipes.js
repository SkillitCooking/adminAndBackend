var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;
var constants = require('../../util/constants');

var mongoose = require('mongoose');
var underscore = require('underscore');
var db = require('../../database');
var Recipe = db.recipes;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

/* GET all recipes */
router.get('/', function(req, res, next) {
  logger.info('START GET api/recipes/');
  Recipe.model.find({}, '-datesUsedAsRecipeOfTheDay', function (err, recipes) {
    if(err) {
      logger.error('ERROR POST api/recipes/', {error: err});
      return next(err);
    }
    logger.info('END GET api/recipes/');
    res.json({data: recipes});
  });
});

/* get recipes with ids */
/* expects req.body to wrap the array... */
router.post('/getRecipesWithIds', function(req, res, next) {
  logger.info('START POST api/recipes/getRecipesWithIds');
  try {
    Recipe.model.find({
      '_id': { $in: req.body.recipeIds }
    }, '-datesUsedAsRecipeOfTheDay', function(err, recipes) {
      if(err) {
        logger.error('ERROR POST api/recipes/getRecipesWithIds', {error: err, body: req.body});
        return next(err);
      }
      var retVal = {
        data: recipes
      };
      logger.info('END POST api/recipes/getRecipesWithIds');
      res.json(retVal);
    });
  } catch(error) {
    logger.error('ERROR - exception in POST api/recipes/getRecipesWithIds', {error: error});
    return next(error);
  }
});

/* getRecipesOfType */
router.post('/getRecipesOfType', function(req, res, next) {
  logger.info('START POST api/recipes/getRecipesOfType');
  try {
    Recipe.model.find({recipeType: req.body.recipeType}, '-datesUsedAsRecipeOfTheDay', function(err, recipes) {
      if(err) {
        logger.error('ERROR POST api/recipes/getRecipesOfType', {error: err, body: req.body});
        return next(err);
      }
      var retVal = {
        data: recipes
      };
      logger.info('END POST api/recipes/getRecipesOfType');
      res.json(retVal);
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/recipes/getRecipesOfType', {error: error});
    return next(error);
  }
});

/* getRecipesForCollection */
router.post('/getRecipesForCollection', function(req, res, next) {
  logger.info('START POST api/recipes/getRecipesForCollection');
  try {
    Recipe.model.find({collectionIds: {$in: [req.body.collectionId]}, recipeType: 'Full'}, '-datesUsedAsRecipeOfTheDay', function(err, recipes) {
      if(err) {
        logger.error('ERROR POST api/recipes/getRecipesForCollection', {error: err, body: req.body});
        return next(err);
      }
      var retVal = {
        data: recipes
      };
      logger.info('END POST api/recipes/getRecipesForCollection');
      res.json(retVal);
    });
  } catch(error) {
    logger.error('ERROR - exception in POST api/recipes/getRecipesForCollection', {error: error});
    return next(error);
  }
});

/* this could get to be a bit of a load on the server as the number of recipes scales up... However, at the given moment, when we really are only going to be dealing with a number of recipes on the level of like 50-100 at max, we're probably OK, given the complexity of handling this full query on the Mongo side */
/* A future iteration will probably have some Mongo query that will reduce the returned set while performing further processing on the server*/
/*Why not identify with ids?*/
router.post('/getRecipesWithIngredients', function(req, res, next) {
  logger.info('START POST api/recipes/getRecipesWithIngredients');
  Recipe.model.find({}, '-datesUsedAsRecipeOfTheDay -stepList -choiceSeasoningProfiles', (err, recipes) => {
    if(err) {
      logger.error('ERROR POST api/recipes/getRecipesWithIngredients', {error: err, body: req.body});
      return next(err);
    }
    try {
      var retRecipes = [];
      retRecipes[0] = [];
      var ingredientIds = req.body.ingredientIds;
      for (var k = recipes.length - 1; k >= 0; k--) {
        recipes[k].missingNames = [];
        var recipeMissingIngredientCount = 0;
        var ingredientTypes = recipes[k].ingredientList.ingredientTypes;
        var flag = true;
        for (var i = ingredientTypes.length - 1; i >= 0; i--) {
          var count = 0;
          if(ingredientTypes[i].ingredients.length > ingredientTypes[i].minNeeded) {
            recipes[k].isNotOneToOne = true;
          }
          for (var j = ingredientTypes[i].ingredients.length - 1; j >= 0; j--) {
            if(ingredientIds){
              var ingredientId = underscore.find(ingredientIds, function(ingred) {
                return ingredientTypes[i].ingredients[j]._id.equals(ingred._id);
              });
              if(ingredientId) {
                var formFound = false;
                for (var l = ingredientTypes[i].ingredients[j].ingredientForms.length - 1; l >= 0; l--) {
                  var form = underscore.find(ingredientId.formIds, function(formId){
                    return ingredientTypes[i].ingredients[j].ingredientForms[l]._id.equals(formId);
                  });
                  if(form) {
                    count++;
                    recipes[k].containsAtLeastOneIngredient = true;
                    formFound = true;
                  } 
                }
                if(!formFound) {
                  if(ingredientTypes[i].ingredients[j].ingredientForms.length > 1) {
                    recipes[k].missingNames.push(ingredientTypes[i].ingredients[j].name.pluralForm);
                  } else {
                    //assume that the converse of the above stated position is that length === 1
                    if(ingredientTypes[i].ingredients[j].useFormNameForDisplay) {
                      recipes[k].missingNames.push(ingredientTypes[i].ingredients[j].ingredientForms[0].name);
                    } else {
                      recipes[k].missingNames.push(ingredientTypes[i].ingredients[j].name.pluralForm);
                    }
                  }
                }
              } else {
                //mark ingredient
                recipes[k].missingNames.push(ingredientTypes[i].ingredients[j].name.pluralForm);
              }
            }
          }
          if(count < ingredientTypes[i].minNeeded){
            //get count difference aggregate with difference
            //recipeCount
            recipeMissingIngredientCount += (ingredientTypes[i].minNeeded - count);
            flag = false;
          } else if(count < ingredientTypes[i].ingredients.length) {
            recipes[k].setModifiedDisclaimer = true;
          }
        }
        if(flag){
          if(recipes[k].recipeType === "AlaCarte") {
            var pickedRecipe = underscore.pick(recipes[k], '_id', 'name', 'description', 'recipeType', 'recipeCategory', 'mainPictureURL', 'prepTime', 'totalTime', 'ingredientList', 'manActiveTime', 'manTotalTime');
            retRecipes[0].push(pickedRecipe);
          } else {
            var pickedRecipe = underscore.pick(recipes[k], '_id', 'name', 'description', 'recipeType', 'recipeCategory', 'mainPictureURL', 'prepTime', 'totalTime', 'manActiveTime', 'manTotalTime', 'setModifiedDisclaimer');
            retRecipes[0].push(pickedRecipe);
          }
        } else {
          if(!recipes[k].isNotOneToOne && recipes[k].containsAtLeastOneIngredient) {
            if(!retRecipes[recipeMissingIngredientCount]) {
              retRecipes[recipeMissingIngredientCount] = [];
            }
            if(recipes[k].recipeType !== constants.RECIPE_TYPES.ALACARTE) {
              retRecipes[recipeMissingIngredientCount].push(recipes[k]);
            }
          }
        }
      }
      var recipesToReturn = [];
      recipesToReturn = recipesToReturn.concat(retRecipes[0]);
      var missingIngredientLevel = 1;
      while(recipesToReturn.length < constants.MIN_NUM_RECIPES_RETURN) {
        if(retRecipes[missingIngredientLevel] && retRecipes[missingIngredientLevel].length > 0) {
          for (var i = retRecipes[missingIngredientLevel].length - 1; i >= 0; i--) {
            recipesToReturn.push(underscore.pick(retRecipes[missingIngredientLevel][i], '_id', 'name', 'description', 'recipeType', 'recipeCategory', 'mainPictureURL', 'prepTime', 'totalTime', 'manActiveTime', 'manTotalTime', 'missingNames'));
          }
        }
        missingIngredientLevel += 1;
      }
      recipesToReturn = underscore.groupBy(recipesToReturn, "recipeType");
      var retVal = {
        data: recipesToReturn
      };
      logger.info('END POST api/recipes/getRecipesWithIngredients');
      res.json(retVal);
    } catch (error) {
      logger.error('ERROR - exception in POST api/recipes/getRecipesWithIngredients', {error: error});
      return next(error);
    }
  });
});


/* POST /recipes - create a single new recipe */
/* Check for same recipe, but send back an an error and do noting if same name found */
router.post('/', function(req, res, next) {
  logger.info('START POST api/recipes/');
  try {
    var query = {'name': req.body.recipe.name};
    req.body.recipe.dateModified = Date.parse(new Date().toUTCString());
    Recipe.model.findOne(query, function(err, recipe) {
      if (err) {
        logger.error('ERROR POST api/recipes/', {error: err, body: req.body});
        return next(err);
      }
      if (recipe) {
        var retVal = {
          name: "RecipeName",
          message: "Recipe with name " + query.name + " already exists!"
        };
        logger.info('END POST api/recipes/');
        res.json(retVal);
      } else {
        Recipe.model.create(req.body.recipe, function(err, recipe) {
          if(err) {
            logger.error('ERROR POST api/recipes/', {error: err, body: req.body});
            return next(err);
          }
          logger.info('END POST api/recipes/');
          res.json(recipe);
        });
      }
    });
  } catch(error) {
    logger.error('ERROR - exception in POST api/recipes/', {error: error});
    return next(error);
  }
});

/* GET /recipes/:id */
router.get('/:id', function(req, res, next) {
  try {
    logger.info('START GET api/recipes/' + req.params.id);
    Recipe.model.findById(req.params.id, function(err, recipe) {
      if(err) {
        logger.error('ERROR GET api/recipes/' + req.params.id, {error: err});
        return next(err);
      }
      logger.info('END GET api/recipes/' + req.params.id);
      res.json(recipe);
    });
  } catch (error) {
    logger.error('ERROR - exception GET in api/recipes/:id', {error: error});
    return next(error);
  }
});

/* GET recipes of the day with given date */
router.post('/getRecipesOfTheDay', function(req, res, next) {
  logger.info('START POST api/recipes/getRecipesOfTheDay');
  Recipe.model.aggregate()
  .match({$or: [{hasBeenRecipeOfTheDay: true}, {isRecipeOfTheDay: true}]})
  .unwind('$datesUsedAsRecipeOfTheDay')
  .group({_id: '$_id',
          mainPictureURL: {$first: '$mainPictureURL'},
          name: {$first: '$name'},
          description: {$first: '$description'},
          prepTime: {$first: '$prepTime'},
          totalTime: {$first: '$totalTime'},
          dateFeatured: {$last: '$datesUsedAsRecipeOfTheDay'},
          isRecipeOfTheDay: {$first: '$isRecipeOfTheDay'}})
  .sort('-isRecipeOfTheDay -dateFeatured')
  .exec(function(err, recipes) {
    if(err) {
      logger.error('ERROR POST api/recipes/getRecipesOfTheDay', {error: err, body: req.body});
      return next(err);
    }
    var retVal = {
      data: recipes
    };
    logger.info('END POST api/recipes/getRecipesOfTheDay');
    res.json(retVal);
  });
});

/* PUT /recipes/:id */
router.put('/:id', function(req, res, next) {
  try {
    logger.info('START PUT api/recipes/' + req.params.id);
    req.body.recipe.dateModified = Date.parse(new Date().toUTCString());
    Recipe.model.findByIdAndUpdate(req.params.id, req.body.recipe, {new: true, setDefaultsOnInsert: true}, function(err, recipe) {
      if(err) {
        logger.error('ERROR PUT api/recipes/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      logger.info('END PUT api/recipes/' + req.params.id);
      res.json({data: recipe});
    });
  } catch(error) {
    logger.error('ERROR - exception in PUT api/recipes/:id', {error: error});
    return next(error);
  }
});

/* DELETE /recipes/:id */
router.delete('/:id', function(req, res, next) {
  try {
    logger.info('START DELETE api/recipes/' + req.params.id);
    Recipe.model.findByIdAndRemove(req.params.id, function(err, recipe) {
      if(err) {
        logger.error('ERROR DELETE api/recipes/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      logger.info('END DELETE api/recipes/' + req.params.id);
      res.json({data: recipe});
    });
  } catch (error) {
    logger.error('ERROR - exception in DELETE api/recipes/:id', {error: error});
    return next(error);
  }
});

/* dummy test route */
router.post('/dummy', function(req, res, next) {
  res.json({message: 'I am a dummy route'});
});

module.exports = router;