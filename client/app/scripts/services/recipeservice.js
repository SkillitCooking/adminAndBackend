'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.recipeService
 * @description
 * # recipeService
 * Factory for recipe API access in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('recipeService', function (Restangular) {
    // Service logic
    // ...

    var baseRecipes = Restangular.all('recipes');

    // Public API here
    return {
      getAllRecipes: function () {
        return baseRecipes.customGET('/');
      },
      addNewRecipe: function(newRecipe) {
        return baseRecipes.post(newRecipe);
      },
      updateRecipe: function(recipe) {
        return baseRecipes.customPUT({recipe: recipe}, '/' + recipe._id);
      },
      deleteRecipe: function(recipe) {
        return baseRecipes.customDELETE('/' + recipe._id);
      }
    };
  });
