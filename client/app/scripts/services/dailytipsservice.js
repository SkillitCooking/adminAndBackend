'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.dailyTipsService
 * @description
 * # dailyTipsService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('dailyTipsService', function (Restangular, RestangularProductionService) {
    
    var baseDailyTips = Restangular.all('dailyTips');
    var baseProductionDailyTips = RestangularProductionService.all('dailyTips');

    return {
      getAllDailyTips: function (useProd) {
        if(useProd) {
          console.log('baseProdTips: ', baseProductionDailyTips);
          return baseProductionDailyTips.customGET('/');
        } else {
          console.log('baseTips: ', baseDailyTips);
          return baseDailyTips.customGET('/');
        }
      },
      addNewDailyTip: function (newDailyTip, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionDailyTips.post(newDailyTip));
        }
        if(useDev) {
          promises.push(baseDailyTips.post(newDailyTip));
        }
        return Promise.all(promises);
      },
      updateDailyTip: function(tip, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionDailyTips.customPUT({tip: tip}, '/' + tip._id));
        }
        if(useDev) {
          promises.push(baseDailyTips.customPUT({tip: tip}, '/' + tip._id));
        }
        return Promise.all(promises);
      },
      deleteDailyTip: function(tip, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionDailyTips.customDELETE('/' + tip._id));
        }
        if(useDev) {
          promises.push(baseDailyTips.customDELETE('/' + tip._id));
        }
        return Promise.all(promises);
      }
    };
  });
