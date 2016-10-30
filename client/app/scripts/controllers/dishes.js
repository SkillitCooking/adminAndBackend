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

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadDishes = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      dishService.getAllDishes(isProd).then(function(dishes) {
        $scope.dishes = dishes;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadDishes('DEVELOPMENT');

    $scope.reset = function() {
      $window.location.reload(true);
    };

    $scope.noServerSelected = function() {
      return !$scope.useDevServer && !$scope.useProdServer;
    };

    $scope.save = function() {
      dishService.addNewDish({
        dish: {
          name: $scope.dish.name,
          ingredientCapacity: $scope.dish.ingredientCapacity
        }
      }, $scope.useProdServer, $scope.useDevServer).then(function(dish) {
        alert("Successfully saved dish");
        //below can probably be more sophisticated
        $scope.dishes.push(dish[0]);
        $scope.reset();
      }, function(response){
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $scope.reset();
      });
    };
  }]);
