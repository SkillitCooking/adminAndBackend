'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.recipeAdjectiveService
 * @description
 * # recipeAdjectiveService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('recipeAdjectiveService', function (Restangular, RestangularProductionService) {

    var baseRecipeAdjectives = Restangular.all('recipeTitleAdjectives');
    var baseProductionRecipeAdjectives = RestangularProductionService.all('recipeTitleAdjectives');

    return {
      getAllRecipeAdjectives: function(useProd) {
        if(useProd) {
          return baseProductionRecipeAdjectives.customGET('/');
        } else {
          return baseRecipeAdjectives.customGET('/');
        }
      },
      addNewRecipeAdjective: function(newrecipeAdjective, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionRecipeAdjectives.post(newrecipeAdjective));
        }
        if(useDev) {
          promises.push(baseRecipeAdjectives.post(newrecipeAdjective));
        }
        return Promise.all(promises);
      },
      updateRecipeAdjective: function(recipeAdjective, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionRecipeAdjectives.customPUT({recipeAdjective: recipeAdjective}, '/' + recipeAdjective._id));
        }
        if(useDev) {
          promises.push(baseRecipeAdjectives.customPUT({recipeAdjective: recipeAdjective}, '/' + recipeAdjective._id));
        }
        return Promise.all(promises);
      },
      deleteRecipeAdjective: function(recipeAdjective, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionRecipeAdjectives.customDELETE('/' + recipeAdjective._id));
        }
        if(useDev) {
          promises.push(baseRecipeAdjectives.customDELETE('/' + recipeAdjective._id));
        }
        return Promise.all(promises);
      }
    };

  });
