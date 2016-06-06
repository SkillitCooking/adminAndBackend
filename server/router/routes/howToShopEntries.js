var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = require('../../database');
var HowToShopEntry = db.howToShopEntries;

module.exports = router;