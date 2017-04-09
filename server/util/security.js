var crypto = require('crypto');
var facebook_app_secret = '85e2e4b309752c7f3329808d4acbc6ff';

var service = {};

service.getFacebookAppSecretProof = function(token) {
	var facebook_hmac = crypto.createHmac('sha256', facebook_app_secret);
	facebook_hmac.update(token);
	return facebook_hmac.digest('hex');
};


module.exports = service;