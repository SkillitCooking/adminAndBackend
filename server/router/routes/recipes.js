var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);
var _ = require('lodash');

var logger = require('../../util/logger').serverLogger;
var constants = require('../../util/constants');

var recipeBadgeService = require('../lib/recipebadges');
var shopifyService = require('../lib/shopifyService');
var mailingService = require('../lib/mailingService');

var mongoose = require('mongoose');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);
var underscore = require('underscore');
var db = require('../../database');
var Recipe = db.recipes;
var User = db.users;
var HealthModifier = db.healthModifiers;
var RecipeTitleAdjective = db.recipeTitleAdjectives;
var SeasoningProfile = db.seasoningProfiles;

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

//middleware for setting default compatibility version
router.use(function(req, res, next) {
  if(!req.body.compatibilityVersion || typeof req.body.compatibilityVersion !== 'number') {
    req.body.compatibilityVersion = 1;
  }
  next();
});

/*router.get('/getIds', function(req, res, next) {
  Recipe.model.find({}, '_id', function(err, recipes) {
    if(err) {
      console.log('error', err);
      return next(err);
    }
    var retVal = recipes.map(function(recipe) {
      return recipe._id;
    });
    res.json(retVal);
  });
});*/

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
/*router.get('/changes', function(req, res, next) {
  var recipeSavePromises = [];
  var prefixCheckPromises = [];
  prefixCheckPromises.push(HealthModifier.model.find());
  prefixCheckPromises.push(RecipeTitleAdjective.model.find());
  prefixCheckPromises.push(SeasoningProfile.model.find());
  Promise.all(prefixCheckPromises).then(function(results) {
    var modifiers = results[0];
    var adjectives = results[1];
    var seasonings = results[2];
    Recipe.model.find({}, 'name nameBodies', function(err, recipes) {
      if(err) {
        console.log('find error', err);
        return next(err);
      }
      var savePromises = [];
      for (var i = recipes.length - 1; i >= 0; i--) {
        var nameBodies = recipes[i].nameBodies;
        for(var id in nameBodies) {
          var prefixObj = {};
          if(nameBodies[id].textArr) {
            prefixObj.textArr = nameBodies[id].textArr;
          } else {
            prefixObj.textArr = nameBodies[id];
          }
          var seasoningPresent = underscore.some(seasonings, function(seasoning) {
            return seasoning._id == id;
          });
          var modPresent = underscore.some(modifiers, function(modifier) {
            return modifier._id == id;
          });
          var adjPresent = underscore.some(adjectives, function(adjective) {
            return adjective._id == id;
          });
          if(adjPresent){
            prefixObj.type = 'adjective';
          } else if(modPresent) {
            prefixObj.type = 'modifier';
          } else if(seasoningPresent) {
            prefixObj.type = 'seasoning';
          }
          nameBodies[id] = prefixObj;
        }
        recipes[i].markModified('nameBodies');
        savePromises.push(recipes[i].save());
      }
      Promise.all(savePromises).then(function(results) {
        res.json({results: results});
      }).catch(function(err) {
        console.log('promise error: ', err);
        return next(err);
      });
    });
    //res.json({mod: modifiers, sea: seasonings, ajd: adjectives});
  }).catch(function(err) {
    console.log('promise error: ', err);
    return next(err);
  });
});*/

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
      mailingService.mailServerError({error: err, location: 'GET api/recipes/'});
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
      mailingService.mailServerError({error: err, location: 'POST api/recipes/getSingleRecipe'});
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
      '_id': { $in: req.body.recipeIds },
      compatibilityVersion: {$lte: req.body.compatibilityVersion}
    }, '-datesUsedAsRecipeOfTheDay', function(err, recipes) {
      if(err) {
        logger.error('ERROR POST api/recipes/getRecipesWithIds', {error: err, body: req.body});
        mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesWithIds'});
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
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/recipes/getRecipesWithIds'});
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
          mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesOfType'});
          return next(err);
        }
        if(!user) {
          var error = {
            status: constants.STATUS_CODES.UNPROCESSABLE,
            message: 'No user for given id'
          };
          logger.error('ERROR POST api/recipes/getRecipesOfType - no user found', {error: error});
          mailingService.mailServerError({error: err, location: 'POST api/recipes/getSingleRecipe', extra: 'no user found for id ' + req.body.userId});
          //janky handling for bad userIds
          //return next(error);
        }
        if(req.body.userToken !== user.curToken) {
          /*var error = {
            status: constants.STATUS_CODES.UNAUTHORIZED,
            message: 'Credentials for method are missing'
          };
          logger.error('ERROR POST api/recipes/getRecipesOfType/', {error: err});
          return next(err);*/
        }
        var outlawIngredients = [];
        for (var i = user.dietaryPreferences.length - 1; i >= 0; i--) {
          outlawIngredients = outlawIngredients.concat(user.dietaryPreferences[i].outlawIngredients);
        }
        Recipe.model.find({
          compatibilityVersion: {$lte: req.body.compatibilityVersion},
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
            mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesOfType', extra: 'Recipe.find'});
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
      Recipe.model.find({
        recipeType: req.body.recipeType,
        compatibilityVersion: {$lte: req.body.compatibilityVersion}
      }, '-datesUsedAsRecipeOfTheDay', function(err, recipes) {
        if(err) {
          logger.error('ERROR POST api/recipes/getRecipesOfType', {error: err, body: req.body});
          mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesOfType', extra: 'Recipe.find'});
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
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/recipes/getRecipesOfType'});
    return next(error);
  }
});

/* getRecipesForCollection */
/* Seems like this method could stand for a reduction in payload... */
router.post('/getRecipesForCollection', function(req, res, next) {
  logger.info('START POST api/recipes/getRecipesForCollection');
  try {
    var skipNumber = req.body.pageNumber * constants.RECIPES_PER_PAGE;
    if(req.body.userId && req.body.userToken) {
      User.model.findById(req.body.userId, function(err, user) {
        if(err) {
          logger.error('ERROR POST api/ingredients/getRecipesForCollection', {error: err});
          mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesForCollection'});
          return next(err);
        }
        if(!user) {
          var error = {
            status: constants.STATUS_CODES.UNPROCESSABLE,
            message: 'No user for given id'
          };
          logger.error('ERROR POST api/recipes/getRecipesForCollection - no user found', {error: error});
          mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesForCollection', extra: 'no user found for id ' + req.body.userId});
          //handling for anticipated bad userIds
          //return next(error);
        }
        if(req.body.userToken !== user.curToken) {
          /*var error = {
            status: constants.STATUS_CODES.UNAUTHORIZED,
            message: 'Credentials for method are missing'
          };
          logger.error('ERROR POST api/recipes/getRecipesForCollection - token', {error: error});
          return next(error);*/
        }
        var outlawIngredients = [];
        //handling for bad userId case
        if(!user || !user.dietaryPreferences) {
          for (var i = user.dietaryPreferences.length - 1; i >= 0; i--) {
            outlawIngredients = outlawIngredients.concat(user.dietaryPreferences[i].outlawIngredients);
          }
        }
        logger.info('outlawIngredients', {outlaw: outlawIngredients});
        var query;
        if(outlawIngredients.length === 0) {
          query = {
            collectionIds: {$in: [req.body.collectionId]},
            recipeType: 'Full',
            compatibilityVersion: {$lte: req.body.compatibilityVersion}
          };
        } else {
          query = {
            "ingredientList.ingredientTypes": {
              "$not": {
                "$elemMatch": {
                  "$and": [
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
            recipeType: 'Full',
            compatibilityVersion: {$lte: req.body.compatibilityVersion}
          };
        }
        Recipe.model.find(query, '-datesUsedAsRecipeOfTheDay', {skip: skipNumber, limit: constants.RECIPES_PER_PAGE}, function(err, recipes) {
          if(err) {
            logger.error('ERROR POST api/recipes/getRecipesForCollection', {error: err, body: req.body});
            mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesForCollection', extra: 'Recipe.find'});
            return next(err);
          }
          for (var i = recipes.length - 1; i >= 0; i--) {
            recipes[i].badges = recipeBadgeService.getBadgesForRecipe(recipes[i]);
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
      Recipe.model.find({
        collectionIds: {$in: [req.body.collectionId]},
        recipeType: 'Full',
        compatibilityVersion: {$lte: req.body.compatibilityVersion}
      }, '-datesUsedAsRecipeOfTheDay', {skip: skipNumber, limit: constants.RECIPES_PER_PAGE}, function(err, recipes) {
        if(err) {
          logger.error('ERROR POST api/recipes/getRecipesForCollection', {error: err, body: req.body});
          mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesForCollection', extra: 'Recipe.find'});
          return next(err);
        }
        for (var i = recipes.length - 1; i >= 0; i--) {
          recipes[i].badges = recipeBadgeService.getBadgesForRecipe(recipes[i]);
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
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/recipes/getRecipesForCollection'});
    return next(error);
  }
});

/* this could get to be a bit of a load on the server as the number of recipes scales up... However, at the given moment, when we really are only going to be dealing with a number of recipes on the level of like 50-100 at max, we're probably OK, given the complexity of handling this full query on the Mongo side */
/* A future iteration will probably have some Mongo query that will reduce the returned set while performing further processing on the server*/
/*Why not identify with ids?*/

function processRecipesOld(req, recipes, recipesToReturn, outlawIngredients) {
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
            recipes[k].badges = recipeBadgeService.getBadgesForRecipe(recipes[k]);
            if(recipes[k].recipeType === constants.RECIPE_TYPES.ALACARTE) {
              var pickedRecipe = underscore.pick(recipes[k], '_id', 'badges', 'name', 'description', 'recipeType', 'recipeCategory', 'mainPictureURL', 'prepTime', 'totalTime', 'ingredientList', 'manActiveTime', 'manTotalTime');
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
        //possibility for infinite loop IF there is no guarantee for enough Full recipes at any missingIngredient level
        //So have cutoff at 25
        while(recipesToReturn[constants.RECIPE_TYPES.FULL].length < constants.MINIMUM_FULL_RECIPES_RETURN || missingIngredientLevel < 25) {
          if(retRecipes[missingIngredientLevel] && retRecipes[missingIngredientLevel][constants.RECIPE_TYPES.FULL] && retRecipes[missingIngredientLevel][constants.RECIPE_TYPES.FULL].length > 0) {
            for (var i = retRecipes[missingIngredientLevel][constants.RECIPE_TYPES.FULL].length - 1; i >= 0; i--) {
              var recipeToAdd = retRecipes[missingIngredientLevel][constants.RECIPE_TYPES.FULL][i];
              recipeToAdd.badges = recipeBadgeService.getBadgesForRecipe(recipeToAdd);
              recipeToAdd = underscore.pick(recipeToAdd, '_id', 'badges', 'name', 'description', 'recipeType', 'recipeCategory', 'mainPictureURL', 'mainPictureURLs', 'prepTime', 'totalTime', 'manActiveTime', 'manTotalTime', 'missingIngredients', 'nameBodies');
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
    compatibilityVersion: {$lte: req.body.compatibilityVersion},
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
      mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesWithIngredients', extra: 'Recipe.find'});
      return next(err);
    }
    try {
      if(req.body.userId && req.body.userToken) {
        //then user
        User.model.findById(req.body.userId, function(err, user) {
          if(err) {
            logger.error('ERROR POST api/recipes/getRecipesWithIngredients', {error: err});
            mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesWithIngredients'});
            return next(err);
          }
          if(!user) {
            var error = {
              status: constants.STATUS_CODES.UNPROCESSABLE,
              message: 'No user for given id'
            };
            logger.error('ERROR POST api/recipes/getRecipesWithIngredients - no user found', {error: error});
            mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesWithIngredients', extra: 'no user found for id ' + req.body.userId});
            //janky bad userid handling
            //return next(error);
          }
          if(req.body.userToken !== user.curToken) {
            /*var error = {
              status: constants.STATUS_CODES.UNAUTHORIZED,
              message: 'Credentials for method are missing'
            };
            logger.error('ERROR POST api/recipes/getRecipesWithIngredients - token', {error: error});
            return next(error);*/
          }
          var outlawIngredients = [];
          if(user && user.dietaryPreferences) {
            for (var i = user.dietaryPreferences.length - 1; i >= 0; i--) {
              outlawIngredients = outlawIngredients.concat(user.dietaryPreferences[i].outlawIngredients);
            }
          }
          var recipesToReturn = {
            [constants.RECIPE_TYPES.ALACARTE]: [],
            [constants.RECIPE_TYPES.BYO]: [],
            [constants.RECIPE_TYPES.FULL]: []
          };
          processRecipesOld(req, recipes, recipesToReturn, outlawIngredients);
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
        processRecipesOld(req, recipes, recipesToReturn);
        var retVal = {
          data: recipesToReturn
        };
        logger.info('END POST api/recipes/getRecipesWithIngredients');
        res.json(retVal);
      }
    } catch (error) {
      logger.error('ERROR - exception in POST api/recipes/getRecipesWithIngredients', {error: error});
      mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/recipes/getRecipesWithIngredients'});
      return next(error);
    }
  });
});


function filterRecipesByDietaryPreferences(recipes, outlawIngredients) {
  console.log('outlawIngredients', outlawIngredients);
  var returnRecipes = [];
  for (var i = recipes.length - 1; i >= 0; i--) {
    var filterOut = false;
    var types = recipes[i].ingredientList.ingredientTypes;
    for (var j = types.length - 1; j >= 0; j--) {
      var ingredients = types[j].ingredients;
      for (var k = ingredients.length - 1; k >= 0; k--) {
        var outlawIndex = outlawIngredients.indexOf(ingredients[k].name.standardForm);
        if(outlawIndex !== -1) {
          filterOut = true;
        }
      }
    }
    if(!filterOut) {
      returnRecipes.push(recipes[i]);
    }
  }
  return returnRecipes;
}

function mapId(element) {
  return element._id;
}

function mapIngredientFormIds(ingred) {
  return {
    _id: ingred._id,
    formIds: ingred.ingredientForms.map(mapId)
  };
}

function mapMissingIngredObj(ingred) {
  return {
    nameObj: ingred.name,
    _id: ingred._id,
    formIds: ingred.ingredientForms.map(mapId)
  };
}

function looseEquality(a, b) {
  return a == b;
}

function ingredientIdObjsEqual(idObjA, idObjB) {
  if(idObjA._id == idObjB._id) {
    var intersection = _.intersectionWith(idObjA.formIds, idObjB.formIds, looseEquality);
    if(intersection.length > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function getScores(recipe, ingredientIds) {
  //I think ingredientIds are enough given the structure of the recipe.ingredientTypes
  var matchTotal = 0;
  var missingTotal = 0;
  var minNeededMet = true;
  for (var i = recipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
    var type = recipe.ingredientList.ingredientTypes[i];
    var recipeIngredientIds = type.ingredients.map(mapIngredientFormIds);
    var intersection = _.intersectionWith(ingredientIds, recipeIngredientIds, ingredientIdObjsEqual);
    if(type.minNeeded > 0) {
      if(intersection.length < type.minNeeded) {
        minNeededMet = false;
      }
    }
    matchTotal += intersection.length;
    missingTotal += Math.abs(recipeIngredientIds.length - intersection.length);
  }
  var score = {};
  score.matchTotal = matchTotal;
  score.missingTotal = missingTotal;
  score.minNeededMet = minNeededMet;
  return score;
}

function recipeMatchScore(recipeA, recipeB) {
  if(recipeA.scores.minNeededMet && recipeB.scores.minNeededMet) {
    if(recipeA.scores.matchTotal > recipeB.scores.matchTotal) {
      return -1;
    } else if(recipeB.scores.matchTotal > recipeA.scores.matchTotal) {
      return 1;
    } else {
      if(recipeA.scores.missingTotal < recipeB.scores.missingTotal) {
        return -1;
      } else if(recipeB.scores.missingTotal < recipeA.scores.missingTotal) {
        return 1;
      } else {
        return 0;
      }
    }
  } else if(recipeA.scores.minNeededMet && !recipeB.scores.minNeededMet) {
    return -1;
  } else if(!recipeA.scores.minNeededMet && recipeB.scores.minNeededMet) {
    return 1;
  } else {
    if(recipeA.scores.matchTotal > recipeB.scores.matchTotal) {
      return -1;
    } else if(recipeB.scores.matchTotal > recipeA.scores.matchTotal) {
      return 1;
    } else {
      if(recipeA.scores.missingTotal < recipeB.scores.missingTotal) {
        return -1;
      } else if(recipeB.scores.missingTotal < recipeA.scores.missingTotal) {
        return 1;
      } else {
        return 0;
      }
    }
  }
}

function getMissingIngredientsForRecipe(recipe, ingredientIds) {
  var missingIngredients = [];
  var types = recipe.ingredientList.ingredientTypes;
  for (var i = types.length - 1; i >= 0; i--) {
    var ingredients = types[i].ingredients;
    var typeIngredientIds = ingredients.map(mapMissingIngredObj);
    var typeIngredientsMissing = _.differenceWith(typeIngredientIds, ingredientIds, ingredientIdObjsEqual);
    if(typeIngredientIds.length - typeIngredientsMissing.length < types[i].minNeeded) {
      Array.prototype.push.apply(missingIngredients, typeIngredientsMissing);
    }
  }
  return missingIngredients;
}

function processRecipes(recipes, ingredientIds, outlawIngredients) {
  var returnObject = {
    orderedRecipeIds: [],
    returnRecipes: []
  };
  var returnRecipes = [];
  var filteredRecipes;
  if(outlawIngredients) {
    filteredRecipes = filterRecipesByDietaryPreferences(recipes, outlawIngredients);
    console.log('filteredRecipes', filteredRecipes);
  } else {
    filteredRecipes = recipes;
  }
  for (var i = filteredRecipes.length - 1; i >= 0; i--) {
    filteredRecipes[i].scores = getScores(filteredRecipes[i], ingredientIds);
  }
  filteredRecipes.sort(recipeMatchScore);
  returnObject.orderedRecipeIds = filteredRecipes.map(function(recipe) {
    return recipe._id;
  });
  returnRecipes = filteredRecipes.slice(0, constants.RECIPES_PER_PAGE);
  for (var j = returnRecipes.length - 1; j >= 0; j--) {
    returnRecipes[j].badges = recipeBadgeService.getBadgesForRecipe(returnRecipes[j]);
    returnRecipes[j].missingIngredients = getMissingIngredientsForRecipe(returnRecipes[j], ingredientIds);
    returnRecipes[j] = underscore.pick(returnRecipes[j], '_id', 'badges', 'name', 'description', 'recipeType', 'recipeCategory', 'mainPictureURL', 'mainPictureURLs', 'prepTime', 'totalTime', 'manActiveTime', 'manTotalTime', 'missingIngredients', 'nameBodies');
  }
  returnObject.returnRecipes = returnRecipes;
  returnObject.currentIndex = constants.RECIPES_PER_PAGE;
  return returnObject;
}

router.post('/getRecipesWithIngredientsNew', function(req, res, next) {
  logger.info('START POST api/recipes/getRecipesWithIngredients');
  var ingredientFormIds = [];
  if(req.body.ingredientIds) {
    for (var i = req.body.ingredientIds.length - 1; i >= 0; i--) {
      ingredientFormIds = ingredientFormIds.concat(req.body.ingredientIds[i].formIds);
    }
  }
  Recipe.model.find({
    compatibilityVersion: {$lte: req.body.compatibilityVersion},
    recipeType: constants.RECIPE_TYPES.FULL,
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
      mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesWithIngredients', extra: 'Recipe.find'});
      return next(err);
    }
    try {
      if(req.body.userId && req.body.userToken) {
        //then user
        User.model.findById(req.body.userId, function(err, user) {
          if(err) {
            logger.error('ERROR POST api/recipes/getRecipesWithIngredients', {error: err});
            mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesWithIngredients'});
            return next(err);
          }
          if(!user) {
            var error = {
              status: constants.STATUS_CODES.UNPROCESSABLE,
              message: 'No user for given id'
            };
            logger.error('ERROR POST api/recipes/getRecipesWithIngredients - no user found', {error: error});
            mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesWithIngredients', extra: 'no user found for id ' + req.body.userId});
            //janky bad userId handling
            //return next(error);
          }
          if(req.body.userToken !== user.curToken) {
            /*var error = {
              status: constants.STATUS_CODES.UNAUTHORIZED,
              message: 'Credentials for method are missing'
            };
            logger.error('ERROR POST api/recipes/getRecipesWithIngredients - token', {error: error});
            return next(error);*/
          }
          var outlawIngredients = [];
          if(user && user.dietaryPreferences) {
            for (var i = user.dietaryPreferences.length - 1; i >= 0; i--) {
              outlawIngredients = outlawIngredients.concat(user.dietaryPreferences[i].outlawIngredients);
            }
          }
          var returnObject = processRecipes(recipes, req.body.ingredientIds, outlawIngredients);
          var retVal = {
            data: returnObject
          };
          logger.info('END POST api/recipes/getRecipesWithIngredients');
          res.json(retVal);
        });
      } else {
        //then no user
        var returnObject = processRecipes(recipes, req.body.ingredientIds);
        var retVal = {
          data: returnObject
        };
        logger.info('END POST api/recipes/getRecipesWithIngredients');
        res.json(retVal);
      }
    } catch (error) {
      logger.error('ERROR - exception in POST api/recipes/getRecipesWithIngredients', {error: error});
      mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/recipes/getRecipesWithIngredients'});
      return next(error);
    }
  });
});

router.post('/getMoreRecipesForSelection', function(req, res, next) {
  logger.info('START POST api/recipes/getMoreRecipesForSelection');
  try {
    //will have to return new start index
    //'ingredientIds' is a misnomer...
    Recipe.model.find({
      "_id": {"$in": req.body.ingredientIds},
      compatibilityVersion: {$lte: req.body.compatibilityVersion}
    }, function(err, recipes) {
      if(err) {
        logger.error('ERROR - POST api/recipes/getMoreRecipesForSelection');
        return next(err);
      }
      for (var i = recipes.length - 1; i >= 0; i--) {
        recipes[i].badges = recipeBadgeService.getBadgesForRecipe(recipes[i]);
        if(req.body.availableIngredientIds) {
          recipes[i].missingIngredients = getMissingIngredientsForRecipe(recipes[i], req.body.availableIngredientIds);
        }
        recipes[i] = underscore.pick(recipes[i], '_id', 'badges', 'name', 'description', 'recipeType', 'recipeCategory', 'mainPictureURL', 'mainPictureURLs', 'prepTime', 'totalTime', 'manActiveTime', 'manTotalTime', 'missingIngredients', 'nameBodies');
      }
      var retObj = {
        data: recipes
      };
      logger.info('END POST api/recipes/getMoreRecipesForSelection');
      res.json(retObj);
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/recipes/getMoreRecipesForSelection', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/recipes/getMoreRecipesForSelection'});
    return next(error);
  }
});

router.post('/getMoreRecipesForCategory', function(req, res, next) {
  logger.info('START POST api/recipes/getMoreRecipesForCategory');
  try {
    Recipe.model.find({
      "_id": {"$in": req.body.recipeIds},
      compatibilityVersion: {$lte: req.body.compatibilityVersion}
    }, '-datesUsedAsRecipeOfTheDay -stepList -choiceSeasoningProfiles', (err, recipes) => {
      if(err) {
        logger.error('ERROR - POST api/recipes/getMoreRecipesForCategory', {error: err});
        mailingService.mailServerError({error: err, location: 'POST api/recipes/getMoreRecipesForCategory'});
        return next(err);
      }
      var retRecipes, additionalRecipeIds;
      if(recipes.length > constants.RECIPE_CATEGORY_PAGE_SIZE) {
        retRecipes = recipes.slice(0, constants.RECIPE_CATEGORY_PAGE_SIZE);
        var additionalRecipeIds = underscore.map(recipes.slice(constants.RECIPE_CATEGORY_PAGE_SIZE), function(recipe) {
          return recipe._id;
        });
        for (var i = retRecipes.length - 1; i >= 0; i--) {
          retRecipes[i].badges = recipeBadgeService.getBadgesForRecipe(retRecipes[i]);
        }
        retRecipes = {
          recipes: retRecipes,
          additionalRecipeIds: additionalRecipeIds,
          hasMoreToLoad: true
        };
      } else {
        for (var i = recipes.length - 1; i >= 0; i--) {
          recipes[i].badges = recipeBadgeService.getBadgesForRecipe(recipes[i]);
        }
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
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/recipes/getMoreRecipesForCategory'});
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
        mailingService.mailServerError({error: err, location: 'POST api/recipes/'});
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
            mailingService.mailServerError({error: err, location: 'POST api/recipes/'});
            return next(err);
          }
          logger.info('END POST api/recipes/');
          res.json(recipe);
        });
      }
    });
  } catch(error) {
    logger.error('ERROR - exception in POST api/recipes/', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/recipes/'});
    return next(error);
  }
});

/*POST /recipes/getShopifyDescription*/
router.post('/getShopifyDescription', function(req, res, next) {
  try {
    logger.info('START POST api/recipes/getShopifyDescription/');
    var query = {};
    if(req.body.recipeId) {
      query._id = req.body.recipeId;
    } else if(req.body.recipeName) {
      query.name = req.body.name;
    } else {
      var error = {
        status: constants.STATUS_CODES.UNPROCESSABLE,
        message: 'need a recipeName or recipeId'
      };
      logger.error('ERROR POST api/recipes/getShopifyDescription - token', {error: error});
      mailingService.mailServerError({error: err, location: 'POST api/recipes/getShopifyDescription'});
      return next(error);
    }
    Recipe.model.find(query, function(err, recipes) {
      if(err) {
        logger.error('ERROR POST api/recipes/getShopifyDescription', {error: err});
        return next(err);
      }
      var recipe = recipes[0];
      var retVal = {};
      retVal.descriptionHTML = shopifyService.getDescriptionHTML(recipe);
      retVal.pictureURLs = recipe.mainPictureURLs;
      res.json(retVal);
    });
  } catch (error) {
    logger.error('ERROR - exception POST in api/recipes/getShopifyDescription', {error: error});
     mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/recipes/getShopifyDescription'});
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
         mailingService.mailServerError({error: err, location: 'GET api/recipes/' + req.params.id});
        return next(err);
      }
      logger.info('END GET api/recipes/' + req.params.id);
      res.json(recipe);
    });
  } catch (error) {
    logger.error('ERROR - exception GET in api/recipes/:id', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION GET api/recipes/:id'});
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
      mailingService.mailServerError({error: err, location: 'POST api/recipes/getRecipesOfTheDay'});
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
        mailingService.mailServerError({error: err, location: 'PUT api/recipes/' + req.params.id});
        return next(err);
      }
      logger.info('END PUT api/recipes/' + req.params.id);
      res.json({data: recipe});
    });
  } catch(error) {
    logger.error('ERROR - exception in PUT api/recipes/:id', {error: error});
    mailingService.mailServerError({error: err, location: 'EXCEPTION PUT api/recipes/:id'});
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
        mailingService.mailServerError({error: err, location: 'DELETE api/recipes/' + req.params.id});
        return next(err);
      }
      logger.info('END DELETE api/recipes/' + req.params.id);
      res.json({data: recipe});
    });
  } catch (error) {
    logger.error('ERROR - exception in DELETE api/recipes/:id', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION DELETE api/recipes/:id'});
    return next(error);
  }
});

/* dummy test route */
router.post('/dummy', function(req, res, next) {
  res.json({message: 'I am a dummy route'});
});

module.exports = router;