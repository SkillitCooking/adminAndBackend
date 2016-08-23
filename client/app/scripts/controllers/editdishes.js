'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditdishesCtrl
 * @description
 * # EditdishesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditDishesCtrl', ['$scope', 'dishService', function ($scope, dishService) {
    $scope.integerval = $scope.integerval = /^\d*$/;

    dishService.getAllDishes().then(function(dishes) {
      $scope.dishes = dishes;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

    $scope.changeSelectedDish = function() {
      if($scope.selectedDish) {
        $scope.dish = angular.copy($scope.selectedDish);
      }
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedDish();
    };

    $scope.saveChanges = function() {
      dishService.updateDish({
        name: $scope.dish.name,
        ingredientCapacity: $scope.dish.ingredientCapacity,
        _id: $scope.dish._id
      }).then(function(res) {
        alert("Dish successfully updated! Refresh page");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.deleteDish = function() {
      dishService.deleteDish({_id: $scope.dish._id}).then(function(res) {
        alert("Dish successfully deleted! Refresh page");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };
  }]);
