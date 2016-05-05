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

    recipeService.getAllRecipes().then(function(recipes) {
      $scope.recipes = recipes;
      $scope.isExpandedArr = [];
      $scope.isExpandedArr.fill(false);
    }, function(response){
      console.log("Server Error: ", response.message);
      alert("Server Error: " + response.message);
    });

    $scope.toggleRecipeExpansion = function(index) {
      $scope.isExpandedArr[index] = !$scope.isExpandedArr[index];
    };
  }]);
