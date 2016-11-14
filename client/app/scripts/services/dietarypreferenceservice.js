'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.dietaryPreferenceService
 * @description
 * # dietaryPreferenceService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('dietaryPreferenceService', function (Restangular, RestangularProductionService) {
    var baseDietaryPreferences = Restangular.all('dietaryPreferences');
    var baseProductionDietaryPreferences = RestangularProductionService.all('dietaryPreferences');

    return {
      getAllDietaryPreferences: function(useProd) {
        if(useProd) {
          return baseProductionDietaryPreferences.customGET('/');
        } else {
          return baseDietaryPreferences.customGET('/');
        }
      },
      addNewDietaryPreference: function(newDietaryPreference, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionDietaryPreferences.post(newDietaryPreference));
        }
        if(useDev) {
          promises.push(baseDietaryPreferences.post(newDietaryPreference));
        }
        return Promise.all(promises);
      },
      updateDietaryPreference: function(dietaryPreference, useProd, useDev) {
        var promises = [];
        console.log('pref', dietaryPreference);
        if(useProd) {
          promises.push(baseProductionDietaryPreferences.customPUT(dietaryPreference, '/' + dietaryPreference.dietaryPreference._id));
        }
        if(useDev) {
          promises.push(baseDietaryPreferences.customPUT(dietaryPreference, '/' + dietaryPreference.dietaryPreference._id));
        }
        return Promise.all(promises);
      },
      deleteDietaryPreference: function(dietaryPreference, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionDietaryPreferences.customDELETE('/' + dietaryPreference._id));
        }
        if(useDev) {
          promises.push(baseDietaryPreferences.customDELETE('/' + dietaryPreference._id));
        }
        return Promise.all(promises);
      }
    };
  });
