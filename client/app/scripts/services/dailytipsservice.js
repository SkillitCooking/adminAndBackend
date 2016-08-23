'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.dailyTipsService
 * @description
 * # dailyTipsService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('dailyTipsService', function (Restangular) {
    
    var baseDailyTips = Restangular.all('dailyTips');

    return {
      getAllDailyTips: function () {
        return baseDailyTips.customGET('/');
      },
      addNewDailyTip: function (newDailyTip) {
        return baseDailyTips.post(newDailyTip);
      },
      updateDailyTip: function(tip) {
        return baseDailyTips.customPUT({tip: tip}, '/' + tip._id);
      },
      deleteDailyTip: function(tip) {
        return baseDailyTips.customDELETE('/' + tip._id);
      }
    };
  });
