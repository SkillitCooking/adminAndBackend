var mongoose = require('mongoose');
var db = require('../database');
var DailyTip = db.dailyTips;
var Recipe = db.recipes;
var CronJob = require('cron').CronJob;

function setRecipeOfTheDay() {
  Recipe.model.findOne({isRecipeOfTheDay: true}, function(err, recipe) {
    if(err) {
      //need production error handling/logging here
      console.log("ERROR in setRecipeOfTheDay: ", err);
    }
    //reset previous recipe of the day
    if(recipe) {
      console.log("previous dailyRecipe: ", recipe.name);
      if(!recipe.datesUsedAsRecipeOfTheDay) {
        recipe.datesUsedAsRecipeOfTheDay = [];
      }
      recipe.hasBeenRecipeOfTheDay = true;
      recipe.isRecipeOfTheDay = false;
      recipe.datesUsedAsRecipeOfTheDay.push(Date.now());
      recipe.save(function(err, recipe, numAffected) {
        if(err) {
          //need production error handling/logging here
          console.log("ERROR in setRecipeOfTheDay: ", err);
        }
      });
    }
  });
  Recipe.model.count({recipeType: 'Full', hasBeenRecipeOfTheDay: false}, function(err, count) {
    if(err) {
      //need production error handling/logging here
      console.log("ERROR in setRecipeOfTheDay: ", err);
    }
    var random = Math.floor(Math.random() * count);
    Recipe.model.findOne({hasBeenRecipeOfTheDay: false, recipeType: 'Full'}).skip(random).exec(function(err, recipe) {
      if(err) {
        //need production error handling/logging here
        console.log("ERROR in setRecipeOfTheDay: ", err);
      }
      if(recipe) {
        console.log("recipe initial find: ", recipe.name);
        recipe.isRecipeOfTheDay = true;
        recipe.hasBeenRecipeOfTheDay = true;
        recipe.save(function(err, recipe, numAffected) {
          if(err) {
            //need production error handling/logging here
            console.log("ERROR in setRecipeOfTheDay: ", err);
          }
        });
      } else {
        //then reset hasBeenRecipeOfTheDay for all
        Recipe.model.update({recipeType: 'Full'}, {hasBeenRecipeOfTheDay: false}, {multi: true}, function(err) {
          if(err) {
            //need production error handling/logging here
            console.log("ERROR in setRecipeOfTheDay: ", err);
          }
        });
        Recipe.model.findOne({recipeType: 'Full'})./*skip(random).*/eexec(function(err, secondRecipe) {
          if(err) {
            //need production error handling/logging here
            console.log("ERROR in setRecipeOfTheDay: ", err);
          }
          //could use a better random number below...
          if(secondRecipe) {
            console.log("recipe secondary find: ", secondRecipe.name);
            secondRecipe.isRecipeOfTheDay = true;
            secondRecipe.hasBeenRecipeOfTheDay = true;
            secondRecipe.save(function(err, result, numAffected) {
              if(err) {
                //need production error handling/logging here
                console.log("ERROR in setRecipeOfTheDay: ", err);
              }
            });
          } else {
            //error - should have found recipe
            console.log("ERROR: no recipe found after reset");
          }
        });
      }
    });
  });
}

function setDailyTipOfTheDay() {
  //find current TipOfTheDay, reset
  DailyTip.model.findOne({isTipOfTheDay: true}, function(err, tip) {
    if(err) {
      //need production error handling/logging here
      console.log("ERROR in setDailyTipOfTheDay: ", err);
    }
    if(tip) {
      tip.hasBeenDailyTip = true;
      tip.isTipOfTheDay = false;
      tip.save(function(err, tip, numAffected) {
        if(err) {
          //need production error handling/logging here
          console.log("ERROR in setDailyTipOfTheDay: ", err);
        }
      });
    }
  });
  //I should probably adjust the above recipe function in order to separate the initial findOne from the rest of the procedure... may have been a source of bugs from last night
  DailyTip.model.count({hasBeenDailyTip: false}, function(err, count) {
    if(err) {
      //need production error handling/logging here
      console.log("ERROR in setDailyTipOfTheDay: ", err);
    }
    var random = Math.floor(count * Math.random());
    DailyTip.model.findOne({hasBeenDailyTip: false}).skip(random).exec(function(err, tip) {
      if(tip) {
        tip.hasBeenDailyTip = true;
        tip.isTipOfTheDay = true;
        dateFeatured = Date.now();
        tip.save(function(err, tip, numAffected) {
          if(err) {
            //need production error handling/logging here
            console.log("ERROR in setDailyTipOfTheDay: ", err);
          }
        });
      } else {
        //then no tip found - error - always expect tip
        console.log("ERROR in setDailyTipOfTheDay: no tip found wiht hasBeenDailyTip set to false");
      }
    });
  });
}

//make this run every 24 hours at midnight
var job = new CronJob('* * * * * *', function() {
  setRecipeOfTheDay();
  setDailyTipOfTheDay();
}, null, true, 'America/Los_Angeles');

module.exports.job = job;