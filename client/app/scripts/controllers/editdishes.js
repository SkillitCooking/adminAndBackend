'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditdishesCtrl
 * @description
 * # EditdishesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditDishesCtrl', ['$window', '$scope', 'dishService', function ($window, $scope, dishService) {
    $scope.integerval = $scope.integerval = /^\d*$/;

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
      }, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        var recipeStr = "";
        //below could be more thorough
        res = res[0];
        if(res.affectedRecipeIds && res.affectedRecipeIds.length > 0) {
          recipeStr += " Affected Recipe Ids: \n" + res.affectedRecipeIds.toString();
        }
        alert("Dish successfully updated! Refresh page." + recipeStr);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.deleteDish = function() {
      dishService.deleteDish({_id: $scope.dish._id}, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        var recipeStr = "";
        //below could be more thorough
        res = res[0];
        if(res.affectedRecipeIds && res.affectedRecipeIds.length > 0) {
          recipeStr += " Affected Recipe Ids: \n" + res.affectedRecipeIds.toString();
        }
        alert("Dish successfully deleted! Refresh page." + recipeStr);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };
  }]);
