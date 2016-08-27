var redis = require('redis');

var client;

if(process.env.NODE_ENV === 'production') {
  client = redis.createClient();
} else {
  client = {
    set: function() {}
  };
}

module.exports.localStorage = client;