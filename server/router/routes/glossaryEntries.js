var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = require('../../database');
var GlossaryEntry = db.glossaryEntries;

/*GET all glossarys*/
router.get('/', function(req, res, next) {
  GlossaryEntry.model.find(function(err, entries) {
    if(err) return next(err);
    var retVal = {
      data: entries
    };
    res.json(retVal);
  });
});

/*POST a glossaryEntry*/
router.post('/', function(req, res, next) {
  //check if title already exists
  var query = {'title': req.body.glossaryEntry.title};
  GlossaryEntry.model.findOne(query, function(err, entry) {
    if(err) return next(err);
    if(entry) {
      var retVal = {
        name: "GlossaryEntry",
        message: "GlossaryEntry with title " + query.title + " already exists!"
      };
      res.json(retVal);
    } else {
      var glossaryEntry = req.body.glossaryEntry;
      glossaryEntry.dateAdded = Date.now();
      glossaryEntry.dateModified = Date.now();
      GlossaryEntry.model.create(glossaryEntry, function(err, glossaryEntry) {
        if(err) return next(err);
        retVal = {
          data: glossaryEntry
        };
        res.json(retVal);
      });
    }
  });
});

module.exports = router;