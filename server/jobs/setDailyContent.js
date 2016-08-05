var mongoose = require('mongoose');
var db = require('../database');

var logger = require('../util/logger').serverLogger;

var DailyTip = db.dailyTips;
var Recipe = db.recipes;
var CronJob = require('cron').CronJob;

function setRecipeOfTheDay() {
  Recipe.model.findOne({isRecipeOfTheDay: true}, function(err, recipe) {
    if(err) {
      logger.error('ERROR in "findOne" call in function "setRecipeOfTheDay" in "setDailyContent"', {error: err});
    } else {
      //reset previous recipe of the day
      try {
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
          });
        }
      } catch(error) {
        logger.error('ERROR - exception thrown in fn "setRecipeOfTheDay" in "setDailyContent"', {error: error});
      }
    }
  });
  Recipe.model.count({recipeType: 'Full', hasBeenRecipeOfTheDay: false}, function(err, count) {
    if(err) {
      //need production error handling/logging here
      logger.error('ERROR in "count" call in "setRecipeOfTheDay" in "setDailyContent"', {error: err});
    } else {
      var random = Math.floor(Math.random() * count);
      Recipe.model.find({hasBeenRecipeOfTheDay: false, recipeType: 'Full'}).skip(random).limit(1).exec(function(err, recipe) {
        if(err) {
          logger.error('ERROR in "find" call in "setRecipeOfTheDay" in "setDailyContent"', {error: err});
        } else {
          if(recipe && recipe.length > 0) {
            recipe = recipe[0];
            recipe.isRecipeOfTheDay = true;
            recipe.hasBeenRecipeOfTheDay = true;
            recipe.save(function(err, recipe, numAffected) {
              if(err) {
                logger.error('ERROR in "save" call in "setRecipeOfTheDay" in "setDailyContent"', {error: err});
              }
            });
          } else {
            //then reset hasBeenRecipeOfTheDay for all
            Recipe.model.update({recipeType: 'Full'}, {hasBeenRecipeOfTheDay: false}, {multi: true}, function(err) {
              if(err) {
                logger.error('ERROR in "update" call in "setRecipeOfTheDay" in "setDailyContent"', {error: err});
              }
            });
            Recipe.model.find({recipeType: 'Full'}).skip(random).limit(1).exec(function(err, secondRecipe) {
              if(err) {
                logger.error('ERROR in second "find" call in "setRecipeOfTheDay" in "setDailyContent"', {error: err});
              } else {
                //could use a better random number below...
                if(secondRecipe && secondRecipe.length > 0) {
                  secondRecipe = secondRecipe[0];
                  secondRecipe.isRecipeOfTheDay = true;
                  secondRecipe.hasBeenRecipeOfTheDay = true;
                  secondRecipe.save(function(err, result, numAffected) {
                    if(err) {
                      logger.error('ERROR in second "save" call in "setRecipeOfTheDay" in "setDailyContent"', {error: err});
                    }
                  });
                } else {
                  logger.error('ERROR no recipe found after reset in "setRecipeOfTheDay" in "setDailyContent"');
                }
              }
            });
          }
        }
      });
    }
  });
}

function setDailyTipOfTheDay() {
  //find current TipOfTheDay, reset
  DailyTip.model.findOne({isTipOfTheDay: true}, function(err, tip) {
    if(err) {
      logger.error('ERROR in "findOne" call in "setDailyTipOfTheDay" in "setDailyContent"', {error: err});
    }
    if(tip) {
      tip.hasBeenDailyTip = true;
      tip.isTipOfTheDay = false;
      tip.save(function(err, tip, numAffected) {
        if(err) {
          logger.error('ERROR in "save" call in "setDailyTipOfTheDay" in "setDailyContent"', {error: err});
        }
      });
    }
  });
  //I should probably adjust the above recipe function in order to separate the initial findOne from the rest of the procedure... may have been a source of bugs from last night
  DailyTip.model.count({hasBeenDailyTip: false}, function(err, count) {
    if(err) {
      logger.error('ERROR in "count" call in "setDailyTipOfTheDay" in "setDailyContent"', {error: err});
    }
    var random = Math.floor(count * Math.random());
    DailyTip.model.find({hasBeenDailyTip: false}).skip(random).limit(1).exec(function(err, tip) {
      if(tip && tip.length > 0) {
        tip = tip[0];
        tip.hasBeenDailyTip = true;
        tip.isTipOfTheDay = true;
        tip.dateFeatured = Date.now();
        tip.save(function(err, tip, numAffected) {
          if(err) {
            logger.error('ERROR in second "save" call in "setDailyTipOfTheDay" in "setDailyContent"', {error: err});
          }
        });
      } else {
        logger.error('ERROR - not tip found with hasBeenDailyTip set to false in "setDailyTipOfTheDay" in "setDailyContent"', {error: err});
      }
    });
  });
}

//make this run every 24 hours at midnight
var job = new CronJob('00 00 00 * * *', function() {
  setRecipeOfTheDay();
  setDailyTipOfTheDay();
}, null, true, 'Etc/UTC');

module.exports.job = job;