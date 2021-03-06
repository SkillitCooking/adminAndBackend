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
            if(compatibilitySet < 2) {
              compatibilitySet = 2;
            }
            break;
          case 'Remove':
            if(compatibilitySet < 3) {
              compatibilitySet = 3;
            }
            break;
          case 'ReduceHeat':
            compatibilitySet = 4;
            break;
          default:
            break;
        }
      }
      return compatibilitySet;
    };

    return service;
  });
