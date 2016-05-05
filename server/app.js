var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
app.use(logger('dev'));
//order of declaration matters here...
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

var router = require('./router')(app);


/**
 * Development settings
 */
if(app.get('env') === 'development') {
  //use direct version for testing
  console.log('development');
  app.use(express.static(path.join(__dirname, '../client')));
  //This covers serving up the index page
  app.use(express.static(path.join(__dirname, '../client/.tmp')));
  app.use(express.static(path.join(__dirname, '../client/app')));

  //Error Handling
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
      .json({
      message: err.message,
      error: err
    });
  });
}

/**
 * Production Settings
 */
if (app.get('env') === 'production') {
  console.log("production");
  //use more streamlined version for production
  app.use(express.static(path.join(__dirname, '/dist')));
  //get favicon from the right places
  app.use(favicon(__dirname + '/dist/favicon.ico'));

  //production error handler - no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
      .json({
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
