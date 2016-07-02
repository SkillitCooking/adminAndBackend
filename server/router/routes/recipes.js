var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var underscore = require('underscore');
var db = require('../../database');
var Recipe = db.recipes;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

/* GET all recipes */
router.get('/', function(req, res, next) {
  Recipe.model.find(function (err, recipes) {
    if(err) return next(err);
    res.json(recipes);
  });
});

/* get recipes with ids */
/* expects req.body to wrap the array... */
router.post('/getRecipesWithIds', function(req, res, next) {
  Recipe.model.find({
    '_id': { $in: req.body.recipeIds }
  }, function(err, recipes) {
    if(err) return next(err);
    var retVal = {
      data: recipes
    };
    res.json(retVal);
  });
});

/* getRecipesOfType */
router.post('/getRecipesOfType', function(req, res, next) {
  Recipe.model.find({recipeType: req.body.recipeType}, function(err, recipes) {
    if(err) return next(err);
    var retVal = {
      data: recipes
    };
    res.json(retVal);
  });
});

/* getRecipesForCollection */
router.post('/getRecipesForCollection', function(req, res, next) {
  Recipe.model.find({collectionIds: {$in: [req.body.collectionId]}, recipeType: 'Full'}, function(err, recipes) {
    if(err) return next(err);
    var retVal = {
      data: recipes
    };
    res.json(retVal);
  });
});

/* this could get to be a bit of a load on the server as the number of recipes scales up... However, at the given moment, when we really are only going to be dealing with a number of recipes on the level of like 50-100 at max, we're probably OK, given the complexity of handling this full query on the Mongo side */
/* A future iteration will probably have some Mongo query that will reduce the returned set while performing further processing on the server*/
router.post('/getRecipesWithIngredients', function(req, res, next) {
  Recipe.model.find((err, recipes) => {
    if(err) return next(err);
    var retRecipes = [];
    var ingredientNames = req.body.ingredientNames;
    for (var k = recipes.length - 1; k >= 0; k--) {
      var ingredientTypes = recipes[k].ingredientList.ingredientTypes;
      var flag = true;
      for (var i = ingredientTypes.length - 1; i >= 0; i--) {
        var count = 0;
        for (var j = ingredientTypes[i].ingredients.length - 1; j >= 0; j--) {
          if(ingredientNames && ingredientNames.indexOf(ingredientTypes[i].ingredients[j].name) !== -1){
            count++;
          }
        }
        if(count < ingredientTypes[i].minNeeded){
          flag = false;
        }
      }
      if(flag){
        if(recipes[k].recipeType === "AlaCarte") {
          var pickedRecipe = underscore.pick(recipes[k], '_id', 'name', 'description', 'recipeType', 'recipeCategory', 'mainPictureURL', 'prepTime', 'totalTime', 'ingredientList');
          retRecipes.push(pickedRecipe);
        } else {
          var pickedRecipe = underscore.pick(recipes[k], '_id', 'name', 'description', 'recipeType', 'recipeCategory', 'mainPictureURL', 'prepTime', 'totalTime');
          retRecipes.push(pickedRecipe);
        }
      }
    }
    retRecipes = underscore.groupBy(retRecipes, "recipeType");
    var retVal = {
      data: retRecipes
    };
    res.json(retVal);
  });
});


/* POST /recipes - create a single new recipe */
/* Check for same recipe, but send back an an error and do noting if same name found */
router.post('/', function(req, res, next) {
  var query = {'name': req.body.recipe.name};
  Recipe.model.findOne(query, function(err, recipe) {
    if (err) return next(err);
    if (recipe) {
      var retVal = {
        name: "RecipeName",
        message: "Recipe with name " + query.name + " already exists!"
      };
      res.json(retVal);
    } else {
      Recipe.model.create(req.body.recipe, function(err, recipe) {
        if(err) return next(err);
        res.json(recipe);
      });
    }
  });
});

/* GET /recipes/:id */
router.get('/:id', function(req, res, next) {
  Recipe.model.findById(req.params.id, function(err, recipe) {
    if(err) return next(err);
    res.json(recipe);
  });
});

/* GET recipes of the day with given date */
router.post('/getRecipesOfTheDay', function(req, res, next) {
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
    if(err) return next(err);
    var retVal = {
      data: recipes
    };
    res.json(retVal);
  });
});

/* PUT /recipes/:id */
router.put('/:id', function(req, res, next) {
  Recipe.model.findByIdAndUpdate(req.params.id, req.body, function(err, recipe) {
    if(err) return next(err);
    res.json(recipe);
  });
});

/* DELETE /recipes/:id */
router.delete('/:id', function(req, res, next) {
  Recipe.model.findByIdAndRemove(req.params.id, req.body, function(err, recipe) {
    if(err) return next(err);
    res.json(recipe);
  });
});

/* dummy test route */
router.post('/dummy', function(req, res, next) {
  res.json({message: 'I am a dummy route'});
});

module.exports = router;