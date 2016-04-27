var express = require('express');
var router = express.Router();
var underscore = require('underscore');

var mongoose = require('mongoose');
var db = require('../../database');
var Dish = db.dishes;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

/* GET dishes listing */
router.get('/', function(req, res, next) {
  Dish.model.find(function (err, dishes) {
    if(err) return next(err);
    res.json(dishes);
  });
});

/* POST /dishes */
/* check for same dish name */
router.post('/', function(req, res, next) {
  var query = {'name': req.body.dish.name};
  console.log('dishes post');                           
  Dish.model.findOneAndUpdate(query, req.body.dish, {upsert: true},function(err, dish) {
    if (err) return next(err);
    if(dish === null){
      //then inserted, and need it to return
      Dish.model.findOne({'name': req.body.dish.name}, function(err, dish) {
        if(err) return next(err);
        res.json(dish);
      });
    } else {
      //then updated
      res.json(dish);
    }
  });
});

/* GET /dishes/id */
router.get('/:id', function(req, res, next) {
  Dish.model.findById(req.params.id, function(err, dish) {
    if (err) return next(err);
    res.json(dish);
  });
});

/* PUT /dishes/:id */
router.put('/:id', function(req, res, next) {
  Dish.model.findByIdAndUpdate(req.params.id, req.body.dish, 
    {upsert: true}, function(err, dish) {
    if (err) return next(err);
    /* dish is previous value of document */
    res.json(dish);
  });
});

/* DELETE /dishes/:id */
router.delete('/:id', function(req, res, next) {
  Dish.model.findByIdAndRemove(req.params.id, req.body.dish, function(err, dish) {
    if (err) return next(err);
    /* dish is the value of just-deleted document */
    res.json(dish);
  });
});

module.exports = router;