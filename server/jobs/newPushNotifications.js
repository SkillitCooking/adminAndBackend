var mongoose = require('mongoose');
var moment = require('moment');
var request = require('request');
var db = require('../database');
var CronJob = require('cron').CronJob;

var logger = require('../util/logger').serverLogger;
var constants = require('../util/constants');
var timezoneLib = require('../util/timezones');

//Needs from this file:
//Single job at midnight (or some other time) UTC
//Pull all users with deviceId / other needed thing
//For each user, schedule appropriate pushNotification
//subdivision between Daily and Sunday
//
//What are the conditions that I require from users and timezone information? Do I need to continue to 'translate' scraped timezones?

var jobs = [];

//midnight UTC on non-Sundays
var dailyJob = new CronJob('00 00 00 * * 1-6', function() {

}, null, true, 'Etc/UTC');

//midnight UTC on Sundays
var sundayJob = new CronJob('00 00 00 * * 0', function() {

}, null, true, 'Etc/UTC');

module.exports.pushNotificationJobs = jobs;