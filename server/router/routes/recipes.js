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
        var pickedRecipe = underscore.pick(recipes[k], '_id', 'name', 'description', 'recipeType', 'recipeCategory', 'mainPictureURL', 'prepTime', 'totalTime');
        retRecipes.push(pickedRecipe);
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
        console.log("before response");
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

/* GET recipe of the day with given date */
router.post('/getRecipeOfTheDay', function(req, res, next) {
  //choose 'random' recipe from set returned that has not been used as a recipe of the day
  Recipe.model.count().exec(function(err, count) {
    if(err) return next(err);
    var random = Math.floor(Math.random() * count);
    Recipe.model.findOne({isRecipeOfTheDay: true}).exec(function(err, recipe) {
      if(err) return next(err);
      //return recipe
      var retVal = {
        data: recipe
      };
      res.json(retVal);
    });
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
router.delete(':/id', function(req, res, next) {
  Recipe.model.findByIdAndRemove(req.params.id, req.body, function(err, recipe) {
    if(err) return next(err);
    res.json(recipe);
  });
});

module.exports = router;