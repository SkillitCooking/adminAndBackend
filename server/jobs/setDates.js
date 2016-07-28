var moment = require('moment');
var CronJob = require('cron').CronJob;
var localStorage = require('../util/localStorage').localStorage;

function setFormattedDate() {
  var formattedDate = moment().format('M+D+YYYY+s');
  localStorage.set('currentDateString', formattedDate);
  console.log('set formattedDate: ', formattedDate);
}

//run every 24 hours at midnight
var job = new CronJob('* * * * * *', function() {
  setFormattedDate();
}, null, true, 'Etc/UTC');
/*
  TODO:
  -create job that runs on UTC midnight that switches date value in localStorage
  -Then: have logger fetch that value, then test on more precise fidelity than what
    we'd be working with in real life
  -Then: import logger to all API methods ==> in testing, make sure to simulate an error
  -Then: create new route for client side logging + test
  -Then: call route at all points for client-side errors
    -Will want to include meta data of what exactly is causing the client-side error
    -Maybe want to include other contextual information... set up structure such that contextual information can be set and sent later on

 */

module.exports.job = job;