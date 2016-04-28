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
        return baseSeasonings.getList();
      },
      addNewSeasoning: function (newSeasoning) {
        return baseSeasonings.post(newSeasoning);
      }
    };
  });
