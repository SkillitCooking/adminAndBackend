var express = require('express');
var router = express.Router();

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var User = db.users;

module.exports = router;