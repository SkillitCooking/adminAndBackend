var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = require('../../database');
var GlossaryEntry = db.glossaryEntries;

module.exports = router;