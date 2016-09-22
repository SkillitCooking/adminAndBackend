var express = require('express');
var router = express.Router();

var constants = require('../../util/constants');

var logger = require('../../util/logger').serverLogger;

var mongoose = require('mongoose');
var db = require('../../database');
var User = db.users;

router.post('/socialLogin', function(req, res, next) {
  logger.info('START POST api/users/socialLogin');
  try {
    var query = {};
    switch(req.body.socialType) {
      case constants.SIGN_IN_SOURCES.FACEBOOK:
        query.facebookId = req.body.socialId;
        break;
      case constants.SIGN_IN_SOURCES.GOOGLE:
        query.googleId = req.body.socialId;
        break;
      default:
        //unrecognized socialType - should probably do some sort of appropriate handling
        var error = {message: 'unrecognized socialType for socialLogin', socialType: req.body.socialType};
        logger.error('ERROR POST api/users/socialLogin/', {error: error});
        error.status = constants.STATUS_CODES.UNPROCESSABLE;
        return next(error);
    }
    User.model.findOne(query, function(err, user) {
      if(err) {
        logger.error('ERROR POST api/users/socialLogin/', {error: err});
        return next(err);
      }
      //expect user - if not present, rely on reference exception being thrown
      user.curToken = req.body.token;
      user.lastLoginDate = Date.parse(new Date().toUTCString());
      if(req.body.email && req.body.email !== "") {
        user.socialEmail = req.body.email;
      }
      if(req.body.name && req.body.name !== "") {
        user.socialName = req.body.name;
      }
      if(req.body.username && req.body.username !== "") {
        user.socialUsername = req.body.username;
      }
      user.save(function(err, user, numAffected) {
        if(err) {
          logger.error('ERROR POST api/users/socialLogin in user.save', {error: err});
          return next(err);
        }
      });
      logger.info('END POST api/users/socialLogin');
      res.json({data: user});
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/users/socialLogin', {error: error});
    return next(error);
  }
});

router.post('/socialSignup', function(req, res, next) {
  logger.info('START POST api/users/socialSignup');
  try {
    var user = {};
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
        logger.error('ERROR POST api/users/socialSignup/', {error: error});
        error.status = constants.STATUS_CODES.UNPROCESSABLE;
        return next(error);
    }
    user.dateCreated = Date.parse(new Date().toUTCString());
    user.lastLoginDate = Date.parse(new Date().toUTCString());
    user.curToken = req.body.token;
    user.socialEmail = req.body.email;
    user.socialName = req.body.name;
    user.socialUsername = req.body.username;
    User.model.create(user, function(err, user) {
      if(err) {
        logger.error('ERROR POST api/users/socialSignup', {error: err});
        return next(err);
      }
      logger.info('END POST api/users/socialSignup');
      res.json({data: user});
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/users/socialSignup', {error: error});
    return next(error);
  }
});

router.post('/emailLogin', function(req, res, next) {
  logger.info('START POST api/users/emailLogin');
  try {
    User.model.findOne({email: req.body.email}, function(err, user) {
      if(err) {
        logger.error('ERROR POST api/users/emailLogin', {error: err});
        return next(err);
      }
      user.curToken = req.body.token;
      user.lastLoginDate = Date.parse(new Date().toUTCString());
      user.save(function(err, user, numAffected) {
        if(err) {
          logger.error('ERROR POST api/users/emailLogin in save user', {error: err});
          return next(err);
        }
        logger.info('END POST api.users/emailLogin');
        res.json({data: user});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/users/emailLogin', {error: error});
    return next(error);
  }
});

router.post('/emailSignup', function(req, res, next) {
  logger.info('START POST api/users/emailSignup');
  try {
    var user = {};
    user.email = req.body.email;
    user.curToken = req.body.token;
    user.signInSource = constants.SIGN_IN_SOURCES.EMAIL;
    user.dateCreated = Date.parse(new Date().toUTCString());
    user.lastLoginDate = Date.parse(new Date().toUTCString());
    User.model.create(user, function(err, user) {
      if(err) {
        logger.error('ERROR POST api/users/emailSignup', {error: err});
        return next(err);
      }
      logger.info('END POST api/users/emailSignup');
      res.json({data: user});
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/users/emailSignup', {error: error});
    return next(error);
  }
});

router.post('/logout', function(req, res, next) {
  //what info should be expected? do a findById - which will necessitate the storage of a user's id on the front end
  try {
    User.model.findById(req.body.userId, function(err, user) {
      if(err) {
        logger.error('ERROR POST api/users/logout');
        return next(err);
      }
      //token check
      if(req.body.token !== user.curToken) {
        var error = {
          status: constants.STATUS_CODES.UNAUTHORIZED,
          message: 'Credentials for method are missing'
        };
        logger.error('ERROR POST api/users/logout - token', {error: error});
        return next(error);
      }
      user.curToken = null;
      user.save(function(err, user, numAffected) {
        if(err) {
          logger.error('ERROR POST api/users/logout in user.save', {error: err});
          return next(err);
        }
        logger.info('END POST api/users/logout');
        res.json({data: user});
      });
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/users/logout', {error: error});
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
        return next(err);
      }
      if(req.body.token !== user.curToken) {
        var error = {
          status: constants.STATUS_CODES.UNAUTHORIZED,
          message: 'Credentials for method are missing'
        };
        logger.error('ERROR POST api/users/updatePersonalInfo - token', {error: error});
        return next(error);
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
      user.save(function(err, user, numAffected) {
        if(err) {
          logger.error('ERROR POST api/users/updatePersonalInfo', {error: err});
          return next(err);
        }
        logger.info('END POST api/users/updatePersonalInfo');
        res.json({data: user});
      });
    });
  } catch(error) {
    logger.error('ERROR - exception in POST api/users/updatePersonalInfo', {error: error});
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
        return next(err);
      }
      if(req.body.token !== user.curToken) {
        var error = {
          status: constants.STATUS_CODES.UNAUTHORIZED,
          message: 'Credentials for method are missing'
        };
        logger.error('ERROR POST api/users/getPersonalInfo - token', {error: error});
        return next(error);
      }
      logger.info('END POST api/users/getPersonalInfo');
      res.json({data: user});
    });
  } catch (error) {
    logger.error('ERROR - exception in POST api/users/getPersonalInfo', {error: error});
    return next(error);
  }
});

module.exports = router;