var mongoose = require('mongoose');
var db = require('../../database');
var User = db.users;
var request = require('request');
var Promise = require('bluebird');
Promise.promisifyAll(request);

var service = {};

service.getFacebookUserAPIPromise = function(appSecretProof, appToken, facebookId, fields) {
	var fieldStr = fields.toString();
	var options = {
		url: 'https://graph.facebook.com/v2.8/' + facebookId,
		qs: {
			fields: fieldStr,
			access_token: appToken,
			app_secret_proof: appSecretProof
		}
	};
	return request.getAsync(options);
};

module.exports = service;