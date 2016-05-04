'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.recipeService
 * @description
 * # recipeService
 * Factory for recipe API access in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('recipeService', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
