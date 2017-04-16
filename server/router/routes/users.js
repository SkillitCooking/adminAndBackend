var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
middleware(router);

var constants = require('../../util/constants');

var logger = require('../../util/logger').serverLogger;
var mailingService = require('../lib/mailingService');
var timezoneService = require('../../util/timezones');
var securityService = require('../../util/security');
var socialService = require('../lib/socialService');

var Promise = require('bluebird');
var mongoose = require('mongoose');
Promise.promisifyAll(mongoose);
var db = require('../../database');
var User = db.users;

/*router.post('/transformEmails', function(req, res, next) {
  //if socialEmail, then email = socialEmail
  User.model.find({socialEmail: {$exists: true}}, function(err, users) {
    if(err) {
      console.log('error: ', err);
      return next(err);
    }
    var savePromises = [];
    for (var i = users.length - 1; i >= 0; i--) {
      users[i].email = users[i].socialEmail;
      savePromises.push(users[i].save());
    }
    Promise.all(savePromises).then(function(results) {
      res.json({results: results});
    }).catch(function(error) {
      console.log('error: ', error);
      return next(err);
    });
  });
});*/

/*router.post('/addTestUser', function(req, res, next) {
  User.model.create(req.body.user, function(err, user) {
    if(err) {
      console.log('err: ', err);
      return next(err);
    }
    res.json({user: user});
  });
});*/

router.post('/registerDevice', function(req, res, next) {
  logger.info('START POST api/users/registerDevice');
  try {
    //check for User with uuid
    var query = {deviceUUID: req.body.deviceUUID};
    var timezoneString = timezoneService.convertTimezone(req.body.timezoneString);
    User.model.findOneAndUpdate(query, {
      timezoneString: timezoneString,
      pushToken: req.body.pushToken,
      actualTimezoneString: req.body.timezoneString,
      deviceUUID: req.body.deviceUUID,
      lastActivityDate: Date.parse(new Date().toUTCString()),
      haveSentInactivityNotification: false
    }, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }, function(err, user) {
      if(err) {
        logger.error('ERROR POST api/users/registerDevice/', {error: err});
        mailingService.mailServerError({error: err, location: 'POST api/users/registerDevice'});
        return next(err);
      }
      res.json({data: user});
    });
  } catch(error) {
    logger.error('ERROR - exception in POST api/users/registerDevice');
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/users/registerDevice'});
    return next(error);
  }
});

/*Note: for socialLogin and socialSignup, probably can be more judicious about when
FB API call is made??*/

function getUserFromUsers(users) {
  //anticipating only 1 and 2 - 3 is a different, emergency case
  if(users.length == 1) {
    return users[0];
  }
  if(users.length == 2) {
    var newUser, deleteUser, deleteUserIndex;

    if(users[0].deviceUUID) {
      deleteUserIndex = 0;
    } else if(users[1].deviceUUID) {
      deleteUserIndex = 1;
    } else {
      deleteUserIndex = -1;
    }
    if(deleteUserIndex === -1) {
      //assumes then that filled in userInformation is on users[1]
      User.model.deleteOne({_id: users[1]._id}, function(err) {});
      return users[0];
    }
    var nonDeleteUserIndex = Math.abs(deleteUserIndex - 1);
    //assumes then that filled in userInformation is on users[1]
    newUser = users[nonDeleteUserIndex];
    newUser.deviceUUID = users[deleteUserIndex].deviceUUID;
    newUser.pushToken = users[deleteUserIndex].pushToken;
    newUser.timezoneString = users[deleteUserIndex].timezoneString;
    newUser.haveSentInactivityNotification = users[deleteUserIndex].haveSentInactivityNotification;
    newUser.actualTimezoneString = users[deleteUserIndex].actualTimezoneString;
    User.model.deleteOne({_id: users[deleteUserIndex]._id}, function(err) {});
    return newUser;
  }
  for (var i = users.length - 1; i >= 1; i--) {
    User.model.deleteOne({_id: users[i]._id}, function(err) {});
  }
  return users[0];
}

function fillOutAndSaveUserSocialLogin(req, res, next, user) {
  user.deviceUUID = req.body.deviceUUID;
  user.lastLoginDate = Date.parse(new Date().toUTCString());
  if(req.body.email && req.body.email !== "") {
    user.socialEmail = req.body.email;
    user.email = req.body.email;
  }
  if(req.body.name && req.body.name !== "") {
    user.socialName = req.body.name;
  }
  if(req.body.firstName && req.body.firstName !== "") {
    user.firstName = req.body.firstName;
  }
  if(req.body.lastName && req.body.lastName !== "") {
    user.lastName = req.body.lastName;
  }
  if(req.body.username && req.body.username !== "") {
    user.socialUsername = req.body.username;
  }
  if(req.body.googleId && req.body.googleId !== "") {
    user.googleId = req.body.googleId;
  }
  if(req.body.facebookId && req.body.facebookId) {
    user.facebookId = req.body.facebookId;
  }
  user.save(function(err, user, numAffected) {
    if(err) {
      logger.error('ERROR POST api/users/socialLogin in user.save', {error: err});
      mailingService.mailServerError({error: err, location: 'POST api/users/socialLogin', extra: 'User.save'});
      return next(err);
    }
    logger.info('END POST api/users/socialLogin');
    res.json({data: user});
  });
}

function fillOutAndSaveUserSocialSignUp(req, res, next, user) {
  user.email = req.body.email;
  user.socialEmail = req.body.email;
  user.socialName = req.body.name;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.socialUsername = req.body.username;
  user.deviceUUID = req.body.deviceUUID;
  var options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  };
  //find by uuid first - findOneAndUpdate
  User.model.findOneAndUpdate(query, user, options, function(err, user) {
    if(err) {
      logger.error('ERROR POST api/users/socialSignup', {error: err});
       mailingService.mailServerError({error: err, location: 'POST api/users/socialSignup'});
      return next(err);
    }
    logger.info('END POST api/users/socialSignup');
    res.json({data: user});
  });
}

router.post('/socialLogin', function(req, res, next) {
  logger.info('START POST api/users/socialLogin');
  try {
    var query;
    switch(req.body.socialType) {
      //don't believe difference is relevant for query lookup
      case constants.SIGN_IN_SOURCES.FACEBOOK:
        query = {
          $or: [
            {deviceUUID: {$exists: true, $eq: req.body.deviceUUID}},
            {$and: [
                {$or: [{deviceUUID: {$exists: false}}, {deviceUUID: {$type: 10}}]},
                {email: {$exists: true, $eq: req.body.email}}
              ]},
            {facebookId: req.body.facebookId},
            {$and: [{socialName: req.body.name},
              {
                $or: 
                [
                  {email: {$type: 10}}, {email: {$exists: false}}
                ]
              }, {
                $or: 
                [
                  {facebookId: {$type: 10}}, {facebookId: {$exists: false}}
                ]
              }, {
                $or: 
                [
                  {googleId: {$type: 10}}, {googleId: {$exists: false}}
                ]
              }
              ]
            }
          ]
        };
        break;
      case constants.SIGN_IN_SOURCES.GOOGLE:
        query = {
          $or: [
            {deviceUUID: {$exists: true, $eq: req.body.deviceUUID}},
            {$and: [
                {$or: [{deviceUUID: {$exists: false}}, {deviceUUID: {$type: 10}}]},
                {email: {$exists: true, $eq: req.body.email}}
              ]},
            {googleId: req.body.googleId},
            {$and: [{socialName: req.body.name},
              {
                $or: 
                [
                  {email: {$type: 10}}, {email: {$exists: false}}
                ]
              }, {
                $or: 
                [
                  {facebookId: {$type: 10}}, {facebookId: {$exists: false}}
                ]
              }, {
                $or: 
                [
                  {googleId: {$type: 10}}, {googleId: {$exists: false}}
                ]
              }
              ]
            }
          ]
        };
        break;
      default:
        //unrecognized socialType - should probably do some sort of appropriate handling
        var error = {message: 'unrecognized socialType for socialLogin', socialType: req.body.socialType};
        error.status = constants.STATUS_CODES.UNPROCESSABLE;
        logger.error('ERROR POST api/users/socialLogin/', {error: error});
        mailingService.mailServerError({error: err, location: 'POST api/users/socialLogin', extra: 'unrecognized socialType: ' + req.body.socialType});
        return next(error);
    }
    User.model.find(query, function(err, users) {
      if(err) {
        logger.error('ERROR POST api/users/socialLogin/', {error: err});
        mailingService.mailServerError({error: err, location: 'POST api/users/socialLogin'});
        return next(err);
      }
      if(!users) {
        var error = {
          status: constants.STATUS_CODES.UNPROCESSABLE,
          message: 'No user for given id'
        };
        logger.error('ERROR POST api/users/socialLogin - no user found', {error: error});
        mailingService.mailServerError({error: err, location: 'POST api/users/socialLogin', extra: 'no user found for id ' + req.body.userId});
        return next(error);
      }
      //parse out and delete users here
      var user = getUserFromUsers(users);
      user.curToken = req.body.token;
      //need equivalent for GOOGLE here...
      if(req.body.socialType === constants.SIGN_IN_SOURCES.FACEBOOK) {
        var fbAppSecretProof = securityService.getFacebookAppSecretProof(req.body.token);
        socialService.getFacebookUserAPIPromise(fbAppSecretProof, req.body.fbAccessToken, req.body.socialId, constants.FB_LOGIN_FIELDS).then(function(response, body) {
          if(response[0] && response[0].body && response[0].body.gender) {
            user.gender = response[0].body.gender;
          }
          fillOutAndSaveUserSocialLogin(req, res, next, user);
        }).catch(function(error) {
          logger.error('ERROR POST api/users/socialLogin in FacebookAPI call', {error: error});
          mailingService.mailServerError({error: error, location: 'POST api/users/socialLogin FacebookAPI call'});
          return next(error);
        });
      } else {
        fillOutAndSaveUserSocialLogin(req, res, next, user);
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/users/socialLogin', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/users/socialLogin'});
    return next(error);
  }
});

router.post('/socialSignup', function(req, res, next) {
  logger.info('START POST api/users/socialSignup');
  try {
    //if found, then update - else, then create
    var query = {
      $or: [
        {deviceUUID: req.body.deviceUUID},
        {email: req.body.email},
        {googleId: req.body.socialId},
        {facebookId: req.body.socialId}
      ]
    };
    User.model.find(query, function(err, users) {
      if(err) {
        logger.error('ERROR POST api/users/socialSignup', {error: err});
         mailingService.mailServerError({error: err, location: 'POST api/users/socialSignup'});
        return next(err);
      }
      var user;
      if(users.length === 0) {
        //then create a user
        user = {};
      } else {
        //then users exist
        user = getUserFromUsers(users);
      }
      switch(req.body.socialType) {
        case constants.SIGN_IN_SOURCES.FACEBOOK:
          user.facebookId = req.body.socialId;
          user.signInSource = constants.SIGN_IN_SOURCES.FACEBOOK;
          break;
        case constants.SIGN_IN_SOURCES.GOOGLE:
          user.googleId = req.body.socialId;
          user.signInSource = constants.SIGN_IN_SOURCES.GOOGLE;
          break;
        default:
          //unrecognized socialType - should probably do some sort of appropriate handling
          var error = {message: 'unrecognized socialType for socialSignup', socialType: req.body.socialType};
          error.status = constants.STATUS_CODES.UNPROCESSABLE;
          logger.error('ERROR POST api/users/socialSignup/', {error: error});
          mailingService.mailServerError({error: err, location: 'POST api/users/socialSignup', extra: 'unrecognized socialType: ' + req.body.socialType});
          return next(error);
      }
      user.dateCreated = Date.parse(new Date().toUTCString());
      user.lastLoginDate = Date.parse(new Date().toUTCString());
      user.curToken = req.body.token;
      if(req.body.socialType === constants.SIGN_IN_SOURCES.FACEBOOK) {
        var fbAppSecretProof = securityService.getFacebookAppSecretProof(req.body.token);
      socialService.getFacebookUserAPIPromise(fbAppSecretProof, req.body.fbAccessToken, req.body.socialId, constants.FB_LOGIN_FIELDS).then(function(response, body) {
          if(response[0] && response[0].body && response[0].body.gender) {
            user.gender = response[0].body.gender;
          }
          fillOutAndSaveUserSocialSignUp(req, res, next, user);
        }).catch(function(error) {
          logger.error('ERROR POST api/users/socialSignup in FacebookAPI call', {error: error});
          mailingService.mailServerError({error: error, location: 'POST api/users/socialSignup FacebookAPI call'});
          return next(error);
        });
      } else {
        fillOutAndSaveUserSocialSignUp(req, res, next, user);
      }
    });
    
  } catch (error) {
    logger.error('ERROR - exception in POST api/users/socialSignup', {error: error});
     mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/users/socialSignup'});
    return next(error);
  }
});

router.post('/emailLogin', function(req, res, next) {
  logger.info('START POST api/users/emailLogin');
  try {
    var query = {
      $or: [
        {deviceUUID: {$exists: true, $eq: req.body.deviceUUID}},
        {$and: [{$or: [{deviceUUID: {$exists: false}}, {deviceUUID: {$type: 10}}]}, {email: {$exists: true, $eq: req.body.email}}]}
      ]
    };
    User.model.find(query, function(err, users) {
      if(err) {
        logger.error('ERROR POST api/users/emailLogin', {error: err});
         mailingService.mailServerError({error: err, location: 'POST api/users/emailLogin'});
        return next(err);
      }
      if(users.length === 0) {
        var error = {
          status: constants.STATUS_CODES.UNPROCESSABLE,
          message: 'No user for given id'
        };
        logger.error('ERROR POST api/users/emailLogin - no user found', {error: error});
        mailingService.mailServerError({error: err, location: 'POST api/users/emailLogin', extra: 'no user found for email ' + req.body.email});
        return next(error);
      }
      var user = getUserFromUsers(users);
      user.curToken = req.body.token;
      user.deviceUUID = req.body.deviceUUID;
      user.lastLoginDate = Date.parse(new Date().toUTCString());
      user.save(function(err, user, numAffected) {
        if(err) {
          logger.error('ERROR POST api/users/emailLogin in save user', {error: err});
          mailingService.mailServerError({error: err, location: 'POST api/users/emailLogin', extra: 'User.save'});
          return next(err);
        }
        logger.info('END POST api.users/emailLogin');
        res.json({data: user});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/users/emailLogin', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/users/emailLogin'});
    return next(error);
  }
});

router.post('/emailSignup', function(req, res, next) {
  logger.info('START POST api/users/emailSignup');
  try {
    var query = {
      $or: [
        {deviceUUID: req.body.deviceUUID},
        {email: req.body.email}
      ]
    };
    User.model.find(query, function(err, users) {
      if(err) {
        logger.error('ERROR POST api/users/emailSignup', {error: err});
        mailingService.mailServerError({error: err, location: 'POST api/users/emailSignup'});
        return next(err);
      }
      var user;
      if(users.length === 0) {
        user = {};
      } else {
        user = getUserFromUsers(users);
      }
      user.email = req.body.email;
      user.curToken = req.body.token;
      user.signInSource = constants.SIGN_IN_SOURCES.EMAIL;
      user.dateCreated = Date.parse(new Date().toUTCString());
      user.lastLoginDate = Date.parse(new Date().toUTCString());
      user.deviceUUID = req.body.deviceUUID;
      var query = {
        $or: [
          {deviceUUID: req.body.deviceUUID},
          {email: req.body.email}
        ]
      };
      var options = {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      };
      User.model.findOneAndUpdate(query, user, options, function(err, user) {
        if(err) {
          logger.error('ERROR POST api/users/emailSignup', {error: err});
          mailingService.mailServerError({error: err, location: 'POST api/users/emailSignup'});
          return next(err);
        }
        logger.info('END POST api/users/emailSignup');
        res.json({data: user});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/users/emailSignup', {error: error});
    mailingService.mailServerError({error: err, location: 'EXCEPTION POST api/users/emailSignup'});
    return next(error);
  }
});

router.post('/logout', function(req, res, next) {
  //what info should be expected? do a findById - which will necessitate the storage of a user's id on the front end
  try {
    User.model.findById(req.body.userId, function(err, user) {
      if(err) {
        logger.error('ERROR POST api/users/logout');
        mailingService.mailServerError({error: err, location: 'POST api/users/logout'});
        return next(err);
      }
      if(user) {
      //token check
        if(req.body.token !== user.curToken) {
          /*var error = {
            status: constants.STATUS_CODES.UNAUTHORIZED,
            message: 'Credentials for method are missing'
          };
          logger.error('ERROR POST api/users/logout - token', {error: error});
          return next(error);*/
        }
        user.curToken = null;
        user.save(function(err, user, numAffected) {
          if(err) {
            logger.error('ERROR POST api/users/logout in user.save', {error: err});
            mailingService.mailServerError({error: err, location: 'POST api/users/logout', extra: 'User.save'});
            return next(err);
          }
          logger.info('END POST api/users/logout');
          res.json({data: user});
        });
      } else {
        var error = {
          status: constants.STATUS_CODES.UNPROCESSABLE,
          message: 'No user for given id'
        };
        logger.error('ERROR POST api/users/logout - no user found', {error: error});
        mailingService.mailServerError({error: err, location: 'POST api/users/logout', extra: 'no user found for id ' + req.body.userId});
        return next(error);
      }
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/users/logout', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/users/logout'});
    return next(error);
  }
});

router.post('/updatePersonalInfo', function(req, res, next) {
  //id, token, email, firstName, lastName, age
  logger.info('START POST api/users/updatePersonalInfo');
  try {
    User.model.findById(req.body.userId, function(err, user) {
      if(err) {
        logger.error('ERROR POST api/users/updatePersonalInfo', {error: err});
        mailingService.mailServerError({error: err, location: 'POST api/users/updatePersonalInfo'});
        return next(err);
      }
      if(!user) {
        var error = {
          status: constants.STATUS_CODES.UNPROCESSABLE,
          message: 'No user for given id'
        };
        logger.error('ERROR POST api/users/updatePersonalInfo - no user found', {error: error});
        mailingService.mailServerError({error: err, location: 'POST api/users/updatePersonalInfo', extra: 'no user found for id ' + req.body.userId});
        return next(error);
      }
      if(req.body.token !== user.curToken) {
        /*var error = {
          status: constants.STATUS_CODES.UNAUTHORIZED,
          message: 'Credentials for method are missing'
        };
        logger.error('ERROR POST api/users/updatePersonalInfo - token', {error: error});
        return next(error);*/
      }
      if(req.body.firstName) {
        user.firstName = req.body.firstName;
      }
      if(req.body.lastName) {
        user.lastName = req.body.lastName;
      }
      if(req.body.age) {
        user.age = req.body.age;
      }
      if(req.body.dietaryPreferences) {
        user.dietaryPreferences = req.body.dietaryPreferences;
      }
      user.save(function(err, user, numAffected) {
        if(err) {
          logger.error('ERROR POST api/users/updatePersonalInfo', {error: err});
          mailingService.mailServerError({error: err, location: 'POST api/users/updatePersonalInfo', extra: 'User.save'});
          return next(err);
        }
        logger.info('END POST api/users/updatePersonalInfo');
        res.json({data: user});
      });
    });
  } catch(error) {
    logger.error('ERROR - exception in POST api/users/updatePersonalInfo', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/users/updatePersonalInfo'});
    return next(error);
  }
});

router.post('/getPersonalInfo', function(req, res, next) {
  //return a user - expecting token, id
  logger.info('START POST api/users/getPersonalInfo');
  try {
    User.model.findById(req.body.userId, function(err, user) {
      if (err) {
        logger.error('ERROR POST api/users/getPersonalInfo', {error: err});
        mailingService.mailServerError({error: err, location: 'POST api/users/getPersonalInfo'});
        return next(err);
      }
      if(!user) {
        var error = {
          status: constants.STATUS_CODES.UNPROCESSABLE,
          message: 'No user for given id'
        };
        logger.error('ERROR POST api/users/getPersonalInfo - no user found', {error: error});
        mailingService.mailServerError({error: err, location: 'POST api/users/getPersonalInfo', extra: 'No user found for id ' + req.body.userId});
        return next(err);
      }
      if(req.body.token !== user.curToken) {
        /*var error = {
          status: constants.STATUS_CODES.UNAUTHORIZED,
          message: 'Credentials for method are missing'
        };
        logger.error('ERROR POST api/users/getPersonalInfo - token', {error: error});
        return next(error);*/
      }
      logger.info('END POST api/users/getPersonalInfo');
      res.json({data: user});
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/users/getPersonalInfo', {error: error});
    mailingService.mailServerError({error: error, location: 'EXCEPTION POST api/users/getPersonalInfo'});
    return next(error);
  }
});

module.exports = router;