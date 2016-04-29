'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.ingredientService
 * @description
 * # ingredientService
 * Factory for ingredient API access in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('ingredientService', function (Restangular) {
    // Service logic
    // ...

    var baseIngredients = Restangular.all('ingredients');

    // Public API here
    return {
      getAllIngredients: function () {
        return baseIngredients.getList();
      },
      addNewIngredient: function(newIngredient) {
        return baseIngredients.post(newIngredient);
      }
    };
  });
