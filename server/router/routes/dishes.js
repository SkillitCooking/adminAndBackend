var express = require('express');
var router = express.Router();
var underscore = require('underscore');

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var Dish = db.dishes;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

/* GET dishes listing */
router.get('/', function(req, res, next) {
  logger.info('START GET api/dishes/');
  Dish.model.find(function (err, dishes) {
    if(err) {
      logger.error('ERROR GET api/dishes/', {error: err});
      return next(err);
    }
    logger.info('END GET api/dishes/');
    res.json(dishes);
  });
});

/* POST /dishes */
/* check for same dish name */
router.post('/', function(req, res, next) {
  logger.info('START POST api/dishes/');
  try{
    var query = {'name': req.body.dish.name};
    Dish.model.findOneAndUpdate(query, req.body.dish, {upsert: true},function(err, dish) {
      if (err) {
        logger.error('ERROR POST api/dishes/', {error: err, body: req.body});
        return next(err);
      }
      if(dish === null){
        //then inserted, and need it to return
        Dish.model.findOne({'name': req.body.dish.name}, function(err, dish) {
          if(err) {
            logger.error('ERROR POST api/dishes/', {error: err, body: req.body});
            return next(err);
          }
          logger.info('END POST api/dishes/');
          res.json(dish);
        });
      } else {
        //then updated
        logger.info('END POST api/dishes/');
        res.json(dish);
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/dishes/', {error: error});
    next(error);
  }
});

/* GET /dishes/id */
router.get('/:id', function(req, res, next) {
  logger.info('START GET api/dishes/' + req.params.id);
  Dish.model.findById(req.params.id, function(err, dish) {
    if (err) {
      logger.error('ERROR GET api/dishes/' + req.params.id, {error: err});
      return next(err);
    }
    logger.info('START GET api/dishes/' + req.params.id);
    res.json(dish);
  });
});

/* PUT /dishes/:id */
router.put('/:id', function(req, res, next) {
  logger.info('START PUT api/dishes/' + req.params.id);
  try {
    Dish.model.findByIdAndUpdate(req.params.id, req.body.dish, 
      {upsert: true}, function(err, dish) {
      if (err) {
        logger.error('ERROR PUT api/dishes/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      /* dish is previous value of document */
      logger.info('END PUT api/dishes/' + req.params.id);
      res.json(dish);
    });
  } catch (error) {
    logger.error('ERROR - exception in PUT api/dishes/:id', {error: error});
    next(error);
  }
});

/* DELETE /dishes/:id */
router.delete('/:id', function(req, res, next) {
  logger.info('START DELETE api/dishes/' + req.params.id);
  try {
    Dish.model.findByIdAndRemove(req.params.id, req.body.dish, function(err, dish) {
      if (err) {
        logger.error('ERROR DELETE api/dishes/' + req.params.id, {error: err, body: req.body});
        return next(err);
      }
      /* dish is the value of just-deleted document */
      logger.info('START DELETE api/dishes/' + req.params.id);
      res.json(dish);
    });
  } catch (error) {
    logger.error('ERROR - exception in DELETE api/dishes/:id', {error: error});
    next(error);
  }
});

module.exports = router;