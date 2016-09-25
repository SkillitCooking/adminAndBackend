var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var FavoriteRecipe = db.favoriteRecipes;
var User = db.users;

router.post('/getFavoriteRecipesForUser', function(req, res, next) {
  logger.info('START POST api/favoriteRecipes/getFavoriteRecipesForUser');
  try {
    User.model.findById(req.body.userId, 'curToken', function(err, user) {
      if(user) {
        //token check
        if(req.body.token !== user.curToken) {
          var error = {
            status: constants.STATUS_CODES.UNAUTHORIZED,
            message: 'Credentials for method are missing'
          };
          logger.error('ERROR POST api/favoriteRecipes/getFavoriteRecipesForUser - token', {error: error});
          return next(error);
        }
        FavoriteRecipe.model.aggregate([{$match: {userId: mongoose.Types.ObjectId(req.body.userId)}}, 
          {$project: {timesUsed: {$size: '$datesUsed'}, recipeIds: 1, ingredientAndFormIds: 1, ingredientNames: 1, userId: 1, dateLastUsed: 1, dateCreated: 1, lastSeasoningProfileUsed: 1, name: 1, description: 1, mainPictureURL: 1, prepTime: 1, totalTime: 1}}], function(err, favRecipes) {
          if(err) {
            logger.error('ERROR POST api/favoriteRecipes/getFavoriteRecipesForUser - favoriteRecipe find', {error: err});
            return next(err);
          }
          //order by date last used eventually?
          res.json({data: favRecipes});
        });
      } else {
        //error - no user found from id
        var error = {
          status: constants.STATUS_CODES.UNAUTHORIZED,
          message: 'No user found from supplied id'
        };
        logger.error('ERROR POST api/favoriteRecipes/getFavoriteRecipesForUser', {error: error, userId: req.body.userId});
        return next(error);
      }
    });
  } catch (error) {
    console.log('thl', error);
    logger.error('ERROR - exception in POST api/favoriteRecipes/getFavoriteRecipesForUser', {error: error});
    return next(error);
  }
});

router.post('/saveFavoriteRecipeForUser', function(req, res, next) {
  logger.info('START POST api/favoriteRecipes/saveFavoriteRecipeForUser');
  try {
    User.model.findById(req.body.userId, 'curToken', function(err, user) {
      if(user) {
        if(req.body.token !== user.curToken) {
          var error = {
            status: constants.STATUS_CODES.UNAUTHORIZED,
            message: 'Credentials for method are missing'
          };
          logger.error('ERROR POST api/favoriteRecipes/saveFavoriteRecipeForUser - token', {error: error});
          return next(error);
        }
        var newFavRecipe = req.body.favoriteRecipe;
        var curDate = Date.parse(new Date().toUTCString());
        newFavRecipe.dateCreated = curDate;
        newFavRecipe.datesUsed = [curDate];
        newFavRecipe.dateLastUsed = curDate;
        FavoriteRecipe.model.create(newFavRecipe, function(err, newFavRecipe) {
          if(err) {
            logger.error('ERROR api/favoriteRecipes/saveFavoriteRecipeForUser in create', {error: err});
            return next(err);
          }
          res.json({data: newFavRecipe});
        });
      } else {
        //error - no user found from id
        var error = {
          status: constants.STATUS_CODES.UNAUTHORIZED,
          message: 'No user found from supplied id'
        };
        logger.error('ERROR POST api/favoriteRecipes/saveFavoriteRecipeForUser', {error: error, userId: req.body.userId});
        return next(error);
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/favoriteRecipes/saveFavoriteRecipeForUser', {error: error});
    return next(error);
  }
});

router.post('/favoriteRecipeUsedForUser', function(req, res, next) {
  logger.info('START POST api/favoriteRecipes/favoriteRecipeUsedForUser');
  try {
    User.model.findById(req.body.userId, 'curToken', function(err, user) {
      if(user) {
        if(req.body.token !== user.curToken) {
          var error = {
            status: constants.STATUS_CODES.UNAUTHORIZED,
            message: 'Credentials for method are missing'
          };
          logger.error('ERROR POST api/favoriteRecipes/favoriteRecipeUsedForUser - token', {error: error});
          return next(error);
        }
        FavoriteRecipe.model.findById(req.body.favoriteRecipeId, 'datesUsed dateLastUsed', function(err, favoriteRecipe) {
          if(favoriteRecipe) {
            var curDate = Date.parse(new Date().toUTCString());
            favoriteRecipe.dateLastUsed = curDate;
            favoriteRecipe.datesUsed.push(curDate);
            favoriteRecipe.save(function(err, favRecipe, numAffected) {
              if(err) {
                logger.error('ERROR POST api/favoriteRecipes/favoriteRecipeUsedForUser - save', {error: err});
                return next(err);
              }
              res.json({data: favRecipe});
            });
          } else {
            //error - no favRecipe for id
            var error = {
              status: constants.STATUS_CODES.UNPROCESSABLE,
              message: 'No favoriteRecipe found from supplied id'
            };
            logger.error('ERROR POST api/favoriteRecipes/favoriteRecipeUsedForUser', {error: error, favoriteRecipeId: req.body.favoriteRecipeId});
            return next(error);
          }
        });
      } else {
        //error - no user found from id
        var error = {
          status: constants.STATUS_CODES.UNAUTHORIZED,
          message: 'No user found from supplied id'
        };
        logger.error('ERROR POST api/favoriteRecipes/favoriteRecipeUsedForUser', {error: error, userId: req.body.userId});
        return next(error);
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/favoriteRecipes/favoriteRecipeUsedForUser', {error: error});
    return next(error);
  }
});

module.exports = router;