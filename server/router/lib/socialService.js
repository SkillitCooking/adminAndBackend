var mongoose = require('mongoose');
var db = require('../../database');
var User = db.users;
var request = require('request');

var service = {};

service.makeFacebookAPICall = function(appSecretProof, appToken, facebookId) {
	var options = {
		url: 'https://graph.facebook.com/v2.8/' + facebookId,
		qs: {
			fields: 'gender,age_range',
			access_token: appToken,
			app_secret_proof: appSecretProof
		}
	};
	request(options, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			console.log('body', body);
		} else {
			//log server error
			console.log('error', error);
			console.log('response', response);
		}
	});
};

module.exports = service;