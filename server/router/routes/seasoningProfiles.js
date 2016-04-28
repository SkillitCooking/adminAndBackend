var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = require('../../database');
var SeasoningProfile = db.seasoningProfiles;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

/* GET seasoningProfiles listing. */
router.get('/', function(req, res, next) {
  SeasoningProfile.model.find(function (err, profiles) {
    if(err) return next(err);
    console.log(profiles);
    res.json(profiles);
  });
});

/* POST /seasoningProfiles */
router.post('/', function(req, res, next) {
  var query = {'name': req.body.seasoningProfile.name};
  SeasoningProfile.model.findOneAndUpdate(query, 
    req.body.seasoningProfile, {upsert: true}, 
    function(err, profile) {
      if (err) return next(err);
      if(profile === null) {
        //then inserted, and need it to return
        SeasoningProfile.model.findOne(query, function(err, profile) {
          if(err) return next(err);
          res.json(profile);
        });
      } else {
        //then updated
        res.json(profile);
      }
  });
});

/* GET /seasoningProfiles/id */
router.get('/:id', function(req, res, next) {
  SeasoningProfile.model.findById(req.params.id, function(err, profile) {
    if (err) return next(err);
    res.json(profile);
  });
});

/* PUT /seasoningProfiles/:id */
router.put('/:id', function(req, res, next) {
  SeasoningProfile.model.findByIdAndUpdate(req.params.id, req.body.seasoningProfile, function(err, profile) {
    if (err) return next(err);
    /* profile is previous value of document */
    res.json(profile);
  });
});

/* DELETE /seasoningProfiles/:id */
router.delete('/:id', function(req, res, next) {
  SeasoningProfile.model.findByIdAndRemove(req.params.id, req.body.seasoningProfile, function(err, profile) {
    if (err) return next(err);
    /* profile is the value of just-deleted document */
    res.json(profile);
  });
});

module.exports = router;
