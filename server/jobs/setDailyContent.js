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
        console.log("fixes isRecipeOfTheDay");
      });
    }
    //find random
    Recipe.model.count({recipeType: 'Full', hasBeenRecipeOfTheDay: false}, function(err, count) {
      if(err) {
        //need production error handling/logging here
        console.log("ERROR in setRecipeOfTheDay: ", err);
      }
      console.log("count: ", count);
      var random = Math.floor(Math.random() * count);
      console.log("random: ", random);
      Recipe.model.find({hasBeenRecipeOfTheDay: false, recipeType: 'Full'}).exec(function(err, recipes) {
        if(err) {
          //need production error handling/logging here
          console.log("ERROR in setRecipeOfTheDay: ", err);
        }
        console.log("recipes length: ", recipes.length);
        if(recipes && recipes.length > 0) {
          recipes[random].isRecipeOfTheDay = true;
          recipes[random].hasBeenRecipeOfTheDay = true;
          recipes[random].save(function(err, recipe, numAffected) {
            if(err) {
              //need production error handling/logging here
              console.log("ERROR in setRecipeOfTheDay: ", err);
            }
            console.log("successfully set recipe of the day: ", recipes[random].name);
          });
        } else {
          //then reset hasBeenRecipeOfTheDay for all
          Recipe.model.update({recipeType: 'Full'}, {hasBeenRecipeOfTheDay: false}, {multi: true}, function(err) {
            if(err) {
              //need production error handling/logging here
              console.log("ERROR in setRecipeOfTheDay: ", err);
            }
            console.log("update");
          });
          Recipe.model.find({recipeType: 'Full'}).exec(function(err, recipes) {
            if(err) {
              //need production error handling/logging here
              console.log("ERROR in setRecipeOfTheDay: ", err);
            }
            //could use a better random number below...
            console.log("recipes length: ", recipes.length);
            if(recipes && recipes.length > 0) {
              recipes[random].isRecipeOfTheDay = true;
              recipes[random].hasBeenRecipeOfTheDay = true;
              recipes[random].save(function(err, recipe, numAffected) {
              if(err) {
                //need production error handling/logging here
                console.log("ERROR in setRecipeOfTheDay: ", err);
              }
              console.log("successfully recipe of day1: ", recipes[random].name);
              });
            } else {
              //error - should have found recipe
              console.log("no recipe found after reset");
            }
          });
        }
      });
    });
  });
}

function setDailyTipOfTheDay() {
  console.log("implement setDailyTipOfTheDay");
}

//make this run every 24 hours at midnight
var job = new CronJob('* * * * * *', function() {
  setRecipeOfTheDay();
  setDailyTipOfTheDay();
}, null, true, 'America/Los_Angeles');

module.exports.job = job;