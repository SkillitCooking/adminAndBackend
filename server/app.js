var express = require('express');
var path = require('path');
var cors = require('cors');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');

//set daily ish
//var dailyContentJobs = require('./jobs/setDailyContent');
var dateJobs = require('./jobs/setDates');
var pushNotificationJobs = require('./jobs/pushNotifications');

var app = express();

app.use(helmet());
app.use(logger('dev'));
//order of declaration matters here...
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
//currently set up to enable all cors requests
app.use(cors());

var router = require('./router')(app);

/**
 * Global Rate Limiter settings
 */
//limit to 10 requests per second per IP
if(app.get('env') === 'production' || app.get('env') === 'staging') {
  var limiterClient = require('redis').createClient();
  var limiter = require('express-limiter')(app, limiterClient);
  limiter({
    path: '*',
    method: 'all',
    lookup: 'connection.remoteAddress',
    total: 10,
    expire: 1000,
    onRateLimited: function(req, res, next) {
      next({ message: 'Rate limit exceeded', status: 429});
    }
  });
}

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
 * Production and Staging Settings
 */
if(app.get('env') === 'production') {
  console.log('production');
}
if(app.get('env') === 'staging') {
  console.log('staging');
}
if (app.get('env') === 'production' || app.get('env') === 'staging') {
  //use more streamlined version for production
  app.use(express.static(path.join(__dirname, '/dist')));
  //get favicon from the right places
  app.use(favicon(__dirname + '/dist/favicon.ico'));

  //production error handler - no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
      .json({
      message: err.message,
      error: err
    });
  });
}

module.exports = app;
