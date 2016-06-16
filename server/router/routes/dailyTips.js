var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = require('../../database');
var DailyTip = db.dailyTips;

/* Add response 'success' signal when time comes */
/* Add Credentials appropriately when time comes */
/* Add Error checking as well */

/* GET all DailyTips */
router.get('/', function(req, res, next) {
  DailyTip.model.find(function (err, tips) {
    if(err) return next(err);
    var retVal = {
      data: tips
    };
    res.json(retVal);
  });
});

/* POST single DailyTip */
router.post('/', function(req, res, next) {
  //need any existence checks? probably for title...
  var query = {'title': req.body.dailyTip.title};
  DailyTip.model.findOne(query, function(err, dailyTip) {
    if(err) return next(err);
    if(dailyTip) {
      //then found
      var retVal = {
        name: "DailyTip Title",
        message: "Daily with title " + query.title + " already exists!"
      };
      res.json(retVal);
    } else {
      //will need to set the applicable dates first here, which will require the use of moment.js library
      var postedTip = req.body.dailyTip;
      postedTip.dateAdded = Date.now();
      postedTip.dateModified = Date.now();
      //null date
      postedTip.dateFeatured = new Date(0);
      DailyTip.model.create(postedTip, function(err, dailyTip) {
        if(err) return next(err);
        res.json(dailyTip);
      });
    }
  });
});

/*  */

module.exports = router;