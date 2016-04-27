var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = require('../../database');
var Ingredient = db.ingredients;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

/* GET ingredients listing. */
router.get('/', function(req, res, next) {
  Ingredient.model.find(function (err, ingredients) {
    if(err) return next(err);
    res.json(ingredients);
  });
});

/* POST /ingredients */
/* Check for same ingredient name*/
router.post('/', function(req, res, next) {
  var query = {'name': req.body.ingredient.name};
  Ingredient.model.findOneAndUpdate(query, req.body.ingredient,
    {upsert: true}, function(err, ingredient) {
    if (err) return next(err);
    if(ingredient === null){
      //then inserted, and need it to return
      Ingredient.model.findOne({'name': req.body.ingredient.name},
        function(err, ingredient) {
          if(err) return next(err);
          res.json(ingredient);
        });
    } else {
      //then updated
      res.json(ingredient);
    }
  });
});

/* GET /ingredients/id */
router.get('/:id', function(req, res, next) {
  Ingredient.model.findById(req.params.id, function(err, ingredient) {
    if (err) return next(err);
    res.json(ingredient);
  });
});

/* PUT /ingredients/:id */
router.put('/:id', function(req, res, next) {
  Ingredient.model.findByIdAndUpdate(req.params.id, req.body.ingredient, function(err, ingredient) {
    if (err) return next(err);
    /* ingredient is previous value of document */
    res.json(ingredient);
  });
});

/* DELETE /ingredients/:id */
router.delete('/:id', function(req, res, next) {
  Ingredient.model.findByIdAndRemove(req.params.id, req.body.ingredient, function(err, ingredient) {
    if (err) return next(err);
    /* ingredient is the value of just-deleted document */
    res.json(ingredient);
  });
});

module.exports = router;
