'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.recipeService
 * @description
 * # recipeService
 * Factory for recipe API access in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('recipeService', function (Restangular, RestangularProductionService) {
    // Service logic
    // ...

    var baseRecipes = Restangular.all('recipes');
    var baseProductionRecipes = RestangularProductionService.all('recipes');

    // Public API here
    return {
      getAllRecipes: function (useProd) {
        if(useProd) {
          return baseProductionRecipes.customGET('/');
        } else {
          return baseRecipes.customGET('/');
        }
      },
      getSingleRecipe: function(id, name, useProd) {
        if(useProd) {
          return baseProductionRecipes.customPOST({id: id, name: name}, 'getSingleRecipe');
        } else {
          return baseRecipes.customPOST({id: id, name: name}, 'getSingleRecipe');
        }
      },
      getAllRecipesNameId: function(useProd) {
        if(useProd) {
          return baseProductionRecipes.customGET('/getAllRecipesNameId');
        } else {
          return baseRecipes.customGET('/getAllRecipesNameId');
        }
      },
      addNewRecipe: function(newRecipe, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionRecipes.post(newRecipe));
        }
        if(useDev) {
          promises.push(baseRecipes.post(newRecipe));
        }
        return Promise.all(promises);
      },
      updateRecipe: function(recipe, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionRecipes.customPUT({recipe: recipe}, '/' + recipe._id));
        }
        if(useDev) {
          promises.push(baseRecipes.customPUT({recipe: recipe}, '/' + recipe._id));
        }
        return Promise.all(promises);
      },
      deleteRecipe: function(recipe, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionRecipes.customDELETE('/' + recipe._id));
        }
        if(useDev) {
          promises.push(baseRecipes.customDELETE('/' + recipe._id));
        }
        return Promise.all(promises);
      },
      getRecipesForBulkAdd: function(useProd) {
        if(useProd) {
          return baseProductionRecipes.customGET('/getRecipesForBulkAdd');
        } else {
          return baseRecipes.customGET('/getRecipesForBulkAdd');
        }
      }
    };
  });
