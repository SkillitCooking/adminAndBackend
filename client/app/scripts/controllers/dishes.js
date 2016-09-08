'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:DishesCtrl
 * @description
 * # DishesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('DishesCtrl', ['$window', '$scope', 'dishService', function ($window, $scope, dishService) {
    $scope.integerval = /^\d*$/;

    dishService.getAllDishes().then(function(dishes) {
      $scope.dishes = dishes;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

    $scope.reset = function() {
      $window.location.reload(true);
    };

    $scope.save = function() {
      dishService.addNewDish({
        dish: {
          name: $scope.dish.name,
          ingredientCapacity: $scope.dish.ingredientCapacity
        }
      }).then(function(dish) {
        alert("Successfully saved dish");
        $scope.dishes.push(dish);
        $scope.reset();
      }, function(response){
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $scope.reset();
      });
    };
  }]);
