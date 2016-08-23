'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.seasoningService
 * @description
 * # seasoningService
 * Factory for seasoning API access in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('seasoningService', function (Restangular) {
    // Service logic
    // ...

    var baseSeasonings = Restangular.all('seasoningProfiles');

    // Public API here
    return {
      getAllSeasonings: function () {
        return baseSeasonings.customGET('/');
      },
      addNewSeasoning: function (newSeasoning) {
        return baseSeasonings.post(newSeasoning);
      },
      updateSeasoning: function (seasoningProfile) {
        return baseSeasonings.customPUT({seasoningProfile: seasoningProfile}, '/' + seasoningProfile._id);
      },
      deleteSeasoning: function (seasoningProfile) {
        return baseSeasonings.customDELETE('/' + seasoningProfile._id);
      }
    };
  });
