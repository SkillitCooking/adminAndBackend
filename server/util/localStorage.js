var redis = require('redis');

var client = redis.createClient();

client.set("test", "this is poop");
client.get("test", function(reply, err) {
  console.log(reply.toString());
});

module.exports.localStorage = client;