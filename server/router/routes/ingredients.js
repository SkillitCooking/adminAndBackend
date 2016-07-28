var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var underscore = require('underscore');
var db = require('../../database');
var Ingredient = db.ingredients;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

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
});

/* GET /ingredients/id */
router.get('/:id', function(req, res, next) {
  logger.info('START GET api/ingredients/' + req.params.id);
  Ingredient.model.findById(req.params.id, function(err, ingredient) {
    if (err) {
      logger.error('ERROR GET api/ingredients/' + req.params.id, {error: err});
      return next(err);
    }
    logger.info('END GET api/ingredients/' + req.params.id);
    res.json(ingredient);
  });
});

/* PUT /ingredients/:id */
router.put('/:id', function(req, res, next) {
  logger.info('START PUT api/ingredients/' + req.params.id);
  Ingredient.model.findByIdAndUpdate(req.params.id, req.body.ingredient, function(err, ingredient) {
    if (err) {
      logger.error('ERROR PUT api/ingredients', {error: err, body: req.body});
      return next(err);
    }
    /* ingredient is previous value of document */
    logger.info('END PUT api/ingredients/' + req.param.id);
    res.json(ingredient);
  });
});

/* DELETE /ingredients/:id */
router.delete('/:id', function(req, res, next) {
  logger.info('START DELETE api/ingredients/' + req.params.id);
  Ingredient.model.findByIdAndRemove(req.params.id, req.body.ingredient, function(err, ingredient) {
    if (err) {
      logger.error('ERROR DELETE api/ingredients/' + req.params.id, {error: err, body: req.body});
      return next(err);
    }
    /* ingredient is the value of just-deleted document */
    logger.info('END DELETE api/ingredients/' + req.params.id);
    res.json(ingredient);
  });
});

module.exports = router;
