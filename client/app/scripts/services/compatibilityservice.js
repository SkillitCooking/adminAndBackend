'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.compatibilityService
 * @description
 * # compatibilityService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('compatibilityService', function () {
    var service = {};

    service.getVersion = function(recipe) {
      var compatibilitySet = 1;
      for (var i = recipe.stepList.length - 1; i >= 0; i--) {
        var type = recipe.stepList[i].stepType;
        switch(type) {
          case 'Move':
          case 'BreakEgg':
          case 'Serve':
            compatibilitySet = 2;
            break;
          default:
            break;
        }
      }
      return compatibilitySet;
    };

    return service;
  });
