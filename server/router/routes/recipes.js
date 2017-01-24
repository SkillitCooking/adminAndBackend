var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);

var logger = require('../../util/logger').serverLogger;
var constants = require('../../util/constants');

var recipeBadgeService = require('../lib/recipebadges');

var mongoose = require('mongoose');
var underscore = require('underscore');
var db = require('../../database');
var Recipe = db.recipes;
var User = db.users;

var fs = require('fs');
//var csv = require('csvtojson');

function nameSort(a, b) {
  if(a.name < b.name) {
    return -1;
  }
  if(a.name > b.name) {
    return 1;
  }
  if(a.name == b.name) {
    return 0;
  }
}

/*router.get('/csv', function(req, res, next) {
  var filename = '/Users/dbratz/Desktop/recipes-ready.csv';
  var nameArr = [];
  var ids = [];
  csv()
  .fromFile(filename)
  .on('json', function(jsonObj) {
    var objId = jsonObj._id.replace(/ObjectId\(/, '');
    objId = objId.replace(/\)$/, '');
    ids.push(objId);
    nameArr.push({
      _id: objId,
      name: jsonObj.name,
      picURL: jsonObj.mainPictureURL
    });
  })
  .on('done', function(err) {
    console.log('done');
    nameArr.sort(nameSort);
    Recipe.model.find({_id: {$in: ids}}, function(err, recipes) {
      if(err) {
        console.log("Error: ", err);
        res.json({error: err});
      }
      for (var i = recipes.length - 1; i >= 0; i--) {
        var newRecipe = underscore.find(nameArr, function(recipe) {
          return recipe._id == recipes[i]._id;
        });
        recipes[i].mainPictureURL = newRecipe.picURL;
        recipes[i].save(function(err, recipe, numAffected) {
          if(err) {
            console.log('errororor: ', err);
            res.json({errroror: err});
          }
        });
      }
      res.json({msg: 'donzo'});
    });
  });
});*/

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */
router.get('/changes', function(req, res, next) {
  Recipe.model.update({}, {
    nameBodies: {},
    conditionalDescriptions: {},
    allowablePrefixIds: [],
    healthModifiers: [],
    titleAdjectives: []
  }, {multi: true}, function(err, raw) {
    if(err) {
      console.log('err', err);
      return next(err);
    }
    res.json({'raw': raw});
  });
});

/* GET all recipes */
router.get('/', function(req, res, next) {
  logger.info('START GET api/recipes/');
  Recipe.model.find({}, '-datesUsedAsRecipeOfTheDay', function (err, recipes) {
    if(err) {
      logger.error('ERROR POST api/recipes/', {error: err});
      return next(err);
    }
    recipes.sort(function(a, b) {
      if(a.name < b.name) {
        return 1;
      }
      if(b.name < a.name) {
        return -1;
      }
      if(a.name === b.name) {
        return 0;
      }
    });
    logger.info('END GET api/recipes/');
    res.json({data: recipes});
  });
});

router.get('/getAllRecipesNameId', function(req, res, next) {
  logger.info('START GET api/recipes/getAllRecipesNameId/');
  Recipe.model.find({}, '_id name', function(err, recipes) {
    if(err) {
      logger.error('ERROR GET api/recipes/getAllRecipesNameId', {error: err});
      return next(err);
    }
    recipes.sort(function(a, b) {
      if(a.name < b.name) {
        return 1;
      }
      if(b.name < a.name) {
        return -1;
      }
      if(a.name === b.name) {
        return 0;
      }
    });
    res.json({data: recipes});
  });
});

router.post('/getSingleRecipe', function(req, res, next) {
  logger.info('START POST api/recipes/getSingleRecipe/');
  var query;
  console.log(req.body);
  if(req.body.id) {
    query = {
      _id: req.body.id
    };
  } else {
    query = {
      name: req.body.name
    };
  }
  Recipe.model.findOne(query, '-datesUsedAsRecipeOfTheDay', function(err, recipe) {
    if(err) {
      logger.error('ERROR POST api/recipes/getSingleRecipe/', {error: err});
      return next(err);
    }
    logger.info('END POST api/recipes/getSingleRecipe/');
    res.json({data: recipe});
  });
});

router.get('/getSingle', function(req, res, next) {
  Recipe.model.findOne({}, '-datesUsedAsRecipeOfTheDay', function(err, recipe) {
    if(err) {
      return next(err);
    }
    res.json({data: recipe});
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
    if(req.body.userId && req.body.userToken) {
      User.model.findById(req.body.userId, function(err, user) {
        if(err) {
          logger.error('ERROR POST api/recipes/getRecipesOfType/', {error: err});
          return next(err);
        }
        if(!user) {
          var error = {
            status: constants.STATUS_CODES.UNPROCESSABLE,
            message: 'No user for given id'
          };
          logger.error('ERROR POST api/recipes/getRecipesOfType - no user found', {error: error});
          return next(error);
        }
        if(req.body.userToken !== user.curToken) {
          var error = {
            status: constants.STATUS_CODES.UNAUTHORIZED,
            message: 'Credentials for method are missing'
          };
          logger.error('ERROR POST api/recipes/getRecipesOfType/', {error: err});
          return next(err);
        }
        var outlawIngredients = [];
        for (var i = user.dietaryPreferences.length - 1; i >= 0; i--) {
          outlawIngredients = outlawIngredients.concat(user.dietaryPreferences[i].outlawIngredients);
        }
        Recipe.model.find({
          recipeType: req.body.recipeType,
          "ingredientList.ingredientTypes": {
              "$not": {
                "$elemMatch": {
                  "ingredients": {
                    "$elemMatch": {
                      "name.standardForm": {"$in": outlawIngredients}
                    }
                  }
                }
              }
            }
        }, '-datesUsedAsRecipeOfTheDay', function(err, recipes) {
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
      });
    } else {
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
    }
  } catch (error) {
    logger.error('ERROR - exception in POST api/recipes/getRecipesOfType', {error: error});
    return next(error);
  }
});

/* getRecipesForCollection */
router.post('/getRecipesForCollection', function(req, res, next) {
  logger.info('START POST api/recipes/getRecipesForCollection');
  try {
    var skipNumber = req.body.pageNumber * constants.RECIPES_PER_PAGE;
    if(req.body.userId && req.body.userToken) {
      User.model.findById(req.body.userId, function(err, user) {
        if(err) {
          logger.error('ERROR POST api/ingredients/getRecipesForCollection', {error: err});
          return next(err);
        }
        if(!user) {
          var error = {
            status: constants.STATUS_CODES.UNPROCESSABLE,
            message: 'No user for given id'
          };
          logger.error('ERROR POST api/recipes/getRecipesForCollection - no user found', {error: error});
          return next(error);
        }
        if(req.body.userToken !== user.curToken) {
          var error = {
            status: constants.STATUS_CODES.UNAUTHORIZED,
            message: 'Credentials for method are missing'
          };
          logger.error('ERROR POST api/recipes/getRecipesForCollection - token', {error: error});
          return next(error);
        }
        var outlawIngredients = [];
        for (var i = user.dietaryPreferences.length - 1; i >= 0; i--) {
          outlawIngredients = outlawIngredients.concat(user.dietaryPreferences[i].outlawIngredients);
        }
        var query;
        if(outlawIngredients.length === 0) {
          query = {
            collectionIds: {$in: [req.body.collectionId]},
            recipeType: 'Full'
          };
        } else {
          query = {
            "ingredientList.ingredientTypes": {
              "$not": {
                "$elemMatch": {
                  "$or": [
                    {"ingredients": {
                      "$elemMatch": {
                        "name.standardForm": {"$in": outlawIngredients}
                      }
                    }},
                    {"minNeeded": {"$gt": 0}}
                  ]
                }
              }
            },
            collectionIds: {$in: [req.body.collectionId]},
            recipeType: 'Full'
          };
        }
        Recipe.model.find(query, '-datesUsedAsRecipeOfTheDay', {skip: skipNumber, limit: constants.RECIPES_PER_PAGE}, function(err, recipes) {
          if(err) {
            logger.error('ERROR POST api/recipes/getRecipesForCollection', {error: err, body: req.body});
            return next(err);
          }
          var retVal = {
            data: recipes
          };
          if(recipes.length < constants.RECIPES_PER_PAGE){
            retVal.hasMoreToLoad = false;
          } else {
            retVal.hasMoreToLoad = true;
          }
          logger.info('END POST api/recipes/getRecipesForCollection');
          res.json(retVal);
        });
      });
    } else {
      //then no credentials provided...
      Recipe.model.find({collectionIds: {$in: [req.body.collectionId]}, recipeType: 'Full'}, '-datesUsedAsRecipeOfTheDay', {skip: skipNumber, limit: constants.RECIPES_PER_PAGE}, function(err, recipes) {
        if(err) {
          logger.error('ERROR POST api/recipes/getRecipesForCollection', {error: err, body: req.body});
          return next(err);
        }
        var retVal = {
          data: recipes
        };
        if(recipes.length < constants.RECIPES_PER_PAGE){
          retVal.hasMoreToLoad = false;
        } else {
          retVal.hasMoreToLoad = true;
        }
        logger.info('END POST api/recipes/getRecipesForCollection');
        res.json(retVal);
      });
    }
  } catch(error) {
    logger.error('ERROR - exception in POST api/recipes/getRecipesForCollection', {error: error});
    return next(error);
  }
});

/* this could get to be a bit of a load on the server as the number of recipes scales up... However, at the given moment, when we really are only going to be dealing with a number of recipes on the level of like 50-100 at max, we're probably OK, given the complexity of handling this full query on the Mongo side */
/* A future iteration will probably have some Mongo query that will reduce the returned set while performing further processing on the server*/
/*Why not identify with ids?*/

function processRecipes(req, recipes, recipesToReturn, outlawIngredients) {
  var retRecipes = [];
  retRecipes[0] = {
    [constants.RECIPE_TYPES.ALACARTE]: [],
    [constants.RECIPE_TYPES.BYO]: [],
    [constants.RECIPE_TYPES.FULL]: []
  };
  var ingredientIds = req.body.ingredientIds;
  if(req.body.ingredientIds && req.body.ingredientIds.length > 0) {
        for (var k = recipes.length - 1; k >= 0; k--) {
          recipes[k].missingIngredients = [];
          var recipeMissingIngredientCount = 0;
          var ingredientTypes = recipes[k].ingredientList.ingredientTypes;
          var flag = true;
          for (var i = ingredientTypes.length - 1; i >= 0; i--) {
            var count = 0;
            if(ingredientTypes[i].ingredients.length > ingredientTypes[i].minNeeded) {
              recipes[k].isNotOneToOne = true;
            }
            for (var j = ingredientTypes[i].ingredients.length - 1; j >= 0; j--) {
              if(outlawIngredients && outlawIngredients.length > 0 && ingredientTypes[i].minNeeded != 0) {
                if(underscore.some(outlawIngredients, function(ingredName) {
                  return ingredientTypes[i].ingredients[j].name.standardForm == ingredName;
                })) {
                  recipes[k].hasOutlawIngredient = true;
                }
              }
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
                      recipes[k].missingIngredients.push({
                        nameObj: ingredientTypes[i].ingredients[j].name,
                        _id: ingredientTypes[i].ingredients[j]._id,
                        formIds: underscore.pluck(ingredientTypes[i].ingredients[j].ingredientForms, '_id')
                      });
                    } else {
                      //assume that the converse of the above stated position is that length === 1
                      if(ingredientTypes[i].ingredients[j].useFormNameForDisplay) {
                        recipes[k].missingIngredients.push({
                        nameObj: ingredientTypes[i].ingredients[j].name,
                        _id: ingredientTypes[i].ingredients[j]._id,
                        formIds: underscore.pluck(ingredientTypes[i].ingredients[j].ingredientForms, '_id')
                      });
                      } else {
                        recipes[k].missingIngredients.push({
                          nameObj: ingredientTypes[i].ingredients[j].name,
                          _id: ingredientTypes[i].ingredients[j]._id,
                          formIds: underscore.pluck(ingredientTypes[i].ingredients[j].ingredientForms, '_id')
                        });
                      }
                    }
                  }
                } else {
                  //mark ingredient
                  recipes[k].missingIngredients.push({
                    nameObj: ingredientTypes[i].ingredients[j].name,
                    _id: ingredientTypes[i].ingredients[j]._id,
                    formIds: underscore.pluck(ingredientTypes[i].ingredients[j].ingredientForms, '_id')
                  });
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
            //recipes[k].badges = recipeBadgeService.getBadgesForRecipe(recipes[k]);
            if(recipes[k].recipeType === constants.RECIPE_TYPES.ALACARTE) {
              var pickedRecipe = underscore.pick(recipes[k], '_id', 'name', 'description', 'recipeType', 'recipeCategory', 'mainPictureURL', 'prepTime', 'totalTime', 'ingredientList', 'manActiveTime', 'manTotalTime');
              retRecipes[0][pickedRecipe.recipeType].push(pickedRecipe);
            } else {
              var pickedRecipe = underscore.pick(recipes[k], '_id', 'name', 'description', 'recipeType', 'recipeCategory', 'mainPictureURL', 'prepTime', 'totalTime', 'manActiveTime', 'manTotalTime', 'setModifiedDisclaimer', 'badges');
              retRecipes[0][pickedRecipe.recipeType].push(pickedRecipe);
            }
          } else {
            if(!recipes[k].isNotOneToOne && recipes[k].containsAtLeastOneIngredient && !recipes[k].hasOutlawIngredient) {
              if(!retRecipes[recipeMissingIngredientCount]) {
                retRecipes[recipeMissingIngredientCount] = {
                  [constants.RECIPE_TYPES.ALACARTE]: [],
                  [constants.RECIPE_TYPES.FULL]: [],
                  [constants.RECIPE_TYPES.BYO]: []
                };
              }
              if(recipes[k].recipeType !== constants.RECIPE_TYPES.ALACARTE) {
                retRecipes[recipeMissingIngredientCount][recipes[k].recipeType].push(recipes[k]);
              }
            }
          }
        }
        recipesToReturn[constants.RECIPE_TYPES.ALACARTE] = recipesToReturn[constants.RECIPE_TYPES.ALACARTE].concat(retRecipes[0][constants.RECIPE_TYPES.ALACARTE]);
        recipesToReturn[constants.RECIPE_TYPES.BYO] = recipesToReturn[constants.RECIPE_TYPES.BYO].concat(retRecipes[0][constants.RECIPE_TYPES.BYO]);
        recipesToReturn[constants.RECIPE_TYPES.FULL] = recipesToReturn[constants.RECIPE_TYPES.FULL].concat(retRecipes[0][constants.RECIPE_TYPES.FULL]);
        var missingIngredientLevel = 1;
        var recipesAdded = 0;
        while(recipesToReturn[constants.RECIPE_TYPES.FULL].length < constants.MINIMUM_FULL_RECIPES_RETURN) {
          if(retRecipes[missingIngredientLevel] && retRecipes[missingIngredientLevel][constants.RECIPE_TYPES.FULL].length > 0) {
            for (var i = retRecipes[missingIngredientLevel][constants.RECIPE_TYPES.FULL].length - 1; i >= 0; i--) {
              var recipeToAdd = retRecipes[missingIngredientLevel][constants.RECIPE_TYPES.FULL][i];
              //recipeToAdd.badges = recipeBadgeService.getBadgesForRecipe(recipeToAdd);
              recipeToAdd = underscore.pick(recipeToAdd, '_id', 'name', 'description', 'recipeType', 'recipeCategory', 'mainPictureURL', 'prepTime', 'totalTime', 'manActiveTime', 'manTotalTime', 'missingIngredients');
              recipeToAdd.usesMissingIngredients = true;
              recipesToReturn[constants.RECIPE_TYPES.FULL].push(recipeToAdd);
              recipesAdded += 1;
            }
          }
          missingIngredientLevel += 1;
        }
        recipesToReturn[constants.RECIPE_TYPES.FULL] = underscore.groupBy(recipesToReturn[constants.RECIPE_TYPES.FULL], "recipeCategory");
        for(var key in recipesToReturn[constants.RECIPE_TYPES.FULL]) {
          //trim below
          if(recipesToReturn[constants.RECIPE_TYPES.FULL][key].length > constants.RECIPE_CATEGORY_PAGE_SIZE) {
            var extraRecipeIds = underscore.map(recipesToReturn[constants.RECIPE_TYPES.FULL][key].slice(constants.RECIPE_CATEGORY_PAGE_SIZE), function(recipe) {
              return recipe._id;
            });
            recipesToReturn[constants.RECIPE_TYPES.FULL][key] = {
              recipes: recipesToReturn[constants.RECIPE_TYPES.FULL][key].slice(0, constants.RECIPE_CATEGORY_PAGE_SIZE),
              additionalRecipeIds: extraRecipeIds,
              hasMoreToLoad: true
            };
          } else {
            recipesToReturn[constants.RECIPE_TYPES.FULL][key] = {
              recipes: recipesToReturn[constants.RECIPE_TYPES.FULL][key],
              hasMoreToLoad: false
            };
          }
        }
      }
}

router.post('/getRecipesWithIngredients', function(req, res, next) {
  logger.info('START POST api/recipes/getRecipesWithIngredients');
  var ingredientFormIds = [];
  if(req.body.ingredientIds) {
    for (var i = req.body.ingredientIds.length - 1; i >= 0; i--) {
      ingredientFormIds = ingredientFormIds.concat(req.body.ingredientIds[i].formIds);
    }
  }
  Recipe.model.find({
    "ingredientList.ingredientTypes": {
      "$elemMatch": {
        "ingredients": {
          "$elemMatch": {
            "_id": {"$in": req.body.ingredientIds},
            "ingredientForms": {
              "$elemMatch": {
                "_id": {"$in": ingredientFormIds}
              }
            }
          }
        }
      }
    }
  }, '-datesUsedAsRecipeOfTheDay -stepList -choiceSeasoningProfiles', (err, recipes) => {
    if(err) {
      logger.error('ERROR POST api/recipes/getRecipesWithIngredients', {error: err, body: req.body});
      return next(err);
    }
    try {
      if(req.body.userId && req.body.userToken) {
        //then user
        User.model.findById(req.body.userId, function(err, user) {
          if(err) {
            logger.error('ERROR POST api/recipes/getRecipesWithIngredients', {error: err});
            return next(err);
          }
          if(!user) {
            var error = {
              status: constants.STATUS_CODES.UNPROCESSABLE,
              message: 'No user for given id'
            };
            logger.error('ERROR POST api/recipes/getRecipesWithIngredients - no user found', {error: error});
            return next(error);
          }
          if(req.body.userToken !== user.curToken) {
            var error = {
              status: constants.STATUS_CODES.UNAUTHORIZED,
              message: 'Credentials for method are missing'
            };
            logger.error('ERROR POST api/recipes/getRecipesWithIngredients - token', {error: error});
            return next(error);
          }
          var outlawIngredients = [];
          for (var i = user.dietaryPreferences.length - 1; i >= 0; i--) {
            outlawIngredients = outlawIngredients.concat(user.dietaryPreferences[i].outlawIngredients);
          }
          var recipesToReturn = {
            [constants.RECIPE_TYPES.ALACARTE]: [],
            [constants.RECIPE_TYPES.BYO]: [],
            [constants.RECIPE_TYPES.FULL]: []
          };
          processRecipes(req, recipes, recipesToReturn, outlawIngredients);
          var retVal = {
            data: recipesToReturn
          };
          logger.info('END POST api/recipes/getRecipesWithIngredients');
          res.json(retVal);
        });
      } else {
        //then no user
        var recipesToReturn = {
          [constants.RECIPE_TYPES.ALACARTE]: [],
          [constants.RECIPE_TYPES.BYO]: [],
          [constants.RECIPE_TYPES.FULL]: []
        };
        processRecipes(req, recipes, recipesToReturn);
        var retVal = {
          data: recipesToReturn
        };
        logger.info('END POST api/recipes/getRecipesWithIngredients');
        res.json(retVal);
      }
    } catch (error) {
      logger.error('ERROR - exception in POST api/recipes/getRecipesWithIngredients', {error: error});
      return next(error);
    }
  });
});

router.post('/getMoreRecipesForCategory', function(req, res, next) {
  logger.info('START POST api/recipes/getMoreRecipesForCategory');
  try {
    Recipe.model.find({
      "_id": {"$in": req.body.recipeIds},
    }, '-datesUsedAsRecipeOfTheDay -stepList -choiceSeasoningProfiles', (err, recipes) => {
      if(err) {
        logger.error('ERROR - POST api/recipes/getMoreRecipesForCategory', {error: err});
        return next(err);
      }
      var retRecipes, additionalRecipeIds;
      if(recipes.length > constants.RECIPE_CATEGORY_PAGE_SIZE) {
        retRecipes = recipes.slice(0, constants.RECIPE_CATEGORY_PAGE_SIZE);
        var additionalRecipeIds = underscore.map(recipes.slice(constants.RECIPE_CATEGORY_PAGE_SIZE), function(recipe) {
          return recipe._id;
        });
        retRecipes = {
          recipes: retRecipes,
          additionalRecipeIds: additionalRecipeIds,
          hasMoreToLoad: true
        };
      } else {
        retRecipes = {
          recipes: recipes,
          additionalRecipeIds: [],
          hasMoreToLoad: false
        };
      }
      res.json({data: retRecipes});
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/recipes/getMoreRecipesForCategory', {error: error});
    return next(error);
  }
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