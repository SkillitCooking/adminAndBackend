'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:RecipeadjectivesCtrl
 * @description
 * # RecipeadjectivesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('RecipeadjectivesCtrl', ['$window', '$scope', 'recipeAdjectiveService', function ($window, $scope, recipeAdjectiveService) {
    $scope.reset = function() {
      $window.location.reload(true);
    };

    $scope.save = function() {
      recipeAdjectiveService.addNewRecipeAdjective({recipeTitleAdjective: {
        name: $scope.recipeAdjective.name
      }}, $scope.useProdServer, $scope.useDevServer).then(function(adjective) {
        alert("Successfully saved adjective");
        $scope.reset();
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
        $scope.reset();
      });
    };
  }]);
