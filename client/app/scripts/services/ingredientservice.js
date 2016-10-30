'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.ingredientService
 * @description
 * # ingredientService
 * Factory for ingredient API access in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('ingredientService', function (Restangular, RestangularProductionService) {
    // Service logic
    // ...

    var baseIngredients = Restangular.all('ingredients');
    var baseProductionIngredients = RestangularProductionService.all('ingredients');

    // Public API here
    return {
      getAllIngredients: function (useProd) {
        if(useProd) {
          return baseProductionIngredients.getList();
        } else {
          return baseIngredients.getList();
        }
      },
      addNewIngredient: function(newIngredient, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionIngredients.post(newIngredient));
        }
        if(useDev) {
          promises.push(baseIngredients.post(newIngredient));
        }
        return Promise.all(promises);
      },
      updateIngredient: function(ingredient, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionIngredients.customPUT({ingredient: ingredient}, '/' + ingredient._id));
        }
        if(useDev) {
          promises.push(baseIngredients.customPUT({ingredient: ingredient}, '/' + ingredient._id));
        }
        return Promise.all(promises);
      },
      deleteIngredient: function(ingredient, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionIngredients.customDELETE('/' + ingredient._id));
        }
        if(useDev) {
          promises.push(baseIngredients.customDELETE('/' + ingredient._id));
        }
        return Promise.all(promises);
      }
    };
  });
