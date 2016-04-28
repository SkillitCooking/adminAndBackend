'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.dishService
 * @description
 * # dishService
 * Factory for dish API access in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('dishService', function (Restangular) {
    // Service logic
    // ...

    var baseDishes = Restangular.all('dishes');

    // Public API here
    return {
      getAllDishes: function () {
        return baseDishes.getList();
      },
      addNewDish: function (newDish) {
        return baseDishes.post(newDish);
      }
    };
  });
