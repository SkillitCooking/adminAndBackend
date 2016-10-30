'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:ViewallrecipesCtrl
 * @description
 * # ViewallrecipesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('ViewallrecipesCtrl', ['$scope', 'recipeService', function ($scope, recipeService) {

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadRecipes = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      recipeService.getAllRecipes(isProd).then(function(recipes) {
        $scope.recipes = recipes.data;
        $scope.isExpandedArr = [];
        $scope.isExpandedArr.fill(false);
      }, function(response){
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadRecipes('DEVELOPMENT');

    $scope.toggleRecipeExpansion = function(index) {
      $scope.isExpandedArr[index] = !$scope.isExpandedArr[index];
    };
  }]);
