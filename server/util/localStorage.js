var redis = require('redis');

//var client = redis.createClient();
var client = {
  set: function() {}
};

module.exports.localStorage = client;