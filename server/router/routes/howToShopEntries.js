var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = require('../../database');
var HowToShopEntry = db.howToShopEntries;

/*GET all howToShopEntries*/
router.get('/', function(req, res, next) {
  HowToShopEntry.model.find(function(err, entries) {
    if(err) return next(err);
    var retVal = {
      data: entries
    };
    res.json(retVal);
  });
});

/*POST single howToShopEntry*/
router.post('/', function(req, res, next) {
  var query = {'title': req.body.howToShopEntry.title};
  HowToShopEntry.model.findOne(query, function(err, entry) {
    if(err) return next(err);
    if(entry) {
      var retVal = {
        name: "HowToShopEntry",
        message: "HowToShopEntry with title " + query.title + " already exists!"
      };
      res.json(retVal);
    } else {
      var howToShopEntry = req.body.howToShopEntry;
      howToShopEntry.dateAdded = Date.now();
      howToShopEntry.dateModified = Date.now();
      HowToShopEntry.model.create(howToShopEntry, function(err, howToShopEntry) {
        if(err) return next(err);
        var retVal = {
          data: howToShopEntry
        };
        res.json(howToShopEntry);
      });
    }
  });
});

module.exports = router;