'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.dishService
 * @description
 * # dishService
 * Factory for dish API access in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('dishService', function (Restangular, RestangularProductionService) {
    // Service logic
    // ...

    var baseDishes = Restangular.all('dishes');
    var baseProductionDishes = RestangularProductionService.all('dishes');

    // Public API here
    return {
      getAllDishes: function (useProd) {
        if(useProd) {
          return baseProductionDishes.getList();
        } else {
          return baseDishes.getList();
        }
      },
      addNewDish: function (newDish, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionDishes.post(newDish));
        }
        if(useDev) {
          promises.push(baseDishes.post(newDish));
        }
        return Promise.all(promises);
      },
      updateDish: function(dish, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionDishes.customPUT({dish: dish}, '/' + dish._id));
        }
        if(useDev) {
          promises.push(baseDishes.customPUT({dish: dish}, '/' + dish._id));
        }
        return Promise.all(promises);
      },
      deleteDish: function(dish, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionDishes.customDELETE('/' + dish._id));
        }
        if(useDev) {
          promises.push(baseDishes.customDELETE('/' + dish._id));
        }
        return Promise.all(promises);
      }
    };
  });
