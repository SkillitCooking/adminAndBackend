'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.seasoningService
 * @description
 * # seasoningService
 * Factory for seasoning API access in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('seasoningService', function (Restangular, RestangularProductionService) {
    // Service logic
    // ...

    var baseSeasonings = Restangular.all('seasoningProfiles');
    var baseProductionSeasonings = RestangularProductionService.all('seasoningProfiles');

    // Public API here
    return {
      getAllSeasonings: function (useProd) {
        if(useProd) {
          return baseProductionSeasonings.customGET('/');
        } else {
          return baseSeasonings.customGET('/');
        }
      },
      addNewSeasoning: function (newSeasoning, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionSeasonings.post(newSeasoning));
        }
        if(useDev) {
          promises.push(baseSeasonings.post(newSeasoning));
        }
        return Promise.all(promises);
      },
      updateSeasoning: function (seasoningProfile, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionSeasonings.customPUT({seasoningProfile: seasoningProfile}, '/' + seasoningProfile._id));
        }
        if(useDev) {
          promises.push(baseSeasonings.customPUT({seasoningProfile: seasoningProfile}, '/' + seasoningProfile._id));
        }
        return Promise.all(promises);
      },
      deleteSeasoning: function (seasoningProfile, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionSeasonings.customDELETE('/' + seasoningProfile._id));
        }
        if(useDev) {
          promises.push(baseSeasonings.customDELETE('/' + seasoningProfile._id));
        }
        return Promise.all(promises);
      }
    };
  });
