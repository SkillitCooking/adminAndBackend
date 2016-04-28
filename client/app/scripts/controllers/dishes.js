'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:DishesCtrl
 * @description
 * # DishesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('DishesCtrl', ['$scope', 'dishService', function ($scope, dishService) {
    $scope.integerval = /^\d*$/;

    dishService.getAllDishes().then(function(dishes) {
      $scope.dishes = dishes;
    }, function(response) {
      console.log("Server Error: ", response.message);
    });

    $scope.reset = function() {
      $scope.dish = angular.copy({});
      $scope.dishForm.nameInput.$setUntouched();
      $scope.dishForm.capacityInput.$setUntouched();
    };

    $scope.save = function() {
      dishService.addNewDish({
        dish: {
          name: $scope.dish.name,
          ingredientCapacity: $scope.dish.ingredientCapacity
        }
      }).then(function(dish) {
        $scope.dishes.push(dish);
      }, function(response){
        console.log("Server Error: ", response.message);
      });
      $scope.dish = angular.copy({});
      $scope.dishForm.nameInput.$setUntouched();
      $scope.dishForm.capacityInput.$setUntouched();
    };
  }]);
