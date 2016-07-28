var moment = require('moment');
var CronJob = require('cron').CronJob;
var localStorage = require('../util/localStorage').localStorage;

var formattedDate = moment().format('M+D+YYYY');

var job = new CronJob('00 00 00 00 00 *', function() {
  localStorage.set('currentDateString', formattedDate);
  console.log('set formattedDate: ', formattedDate);
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