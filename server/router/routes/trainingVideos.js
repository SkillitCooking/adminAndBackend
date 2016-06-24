var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = require('../../database');
var TrainingVideo = db.trainingVideos;

/* GET all trainingVideos */
router.get('/', function(req, res, next) {
  TrainingVideo.model.find(function(err, videos) {
    if(err) return next(err);
    var retVal = {
      data: videos
    };
    res.json(retVal);
  });
});

/*POST single trainingVideo*/
router.post('/', function(req, res, next) {
  var query = {'title': req.body.trainingVideo.title};
  TrainingVideo.model.findOne(query, function(err, video) {
    if(err) return next(err);
    if(video) {
      var retVal = {
        name: "TrainingVideo",
        message: "TrainingVideo with title " + query.title + " already exists!"
      };
      res.json(retVal);
    } else {
      var trainingVideo = req.body.trainingVideo;
      trainingVideo.dateAdded = Date.now();
      trainingVideo.dateModified = Date.now();
      TrainingVideo.model.create(trainingVideo, function(err, trainingVideo) {
        if(err) return next(err);
        var retVal = {
          data: trainingVideo
        };
        res.json(retVal);
      });
    }
  });
});

module.exports = router;