'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditrecipeadjectivesCtrl
 * @description
 * # EditrecipeadjectivesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditrecipeadjectivesCtrl', ['$window', '$scope', 'recipeAdjectiveService', function ($window, $scope, recipeAdjectiveService) {
    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadStuff = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      recipeAdjectiveService.getAllRecipeAdjectives(isProd).then(function(res) {
        $scope.adjectives = res.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadStuff('DEVELOPMENT');

    $scope.changeSelectedAdjective = function() {
      if($scope.selectedAdjective) {
        $scope.recipeAdjective = angular.copy($scope.selectedAdjective);
      }
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedAdjective();
    };

    $scope.saveChanges = function() {
      recipeAdjectiveService.updateRecipeAdjective({
        name: $scope.recipeAdjective.name
      }, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        res = res[0];
        var recipeStr = "";
        if(res.affectedRecipeIds && res.affectedRecipeIds.length > 0) {
          recipeStr += "Affected Recipe Ids: \n" + res.affectedRecipeIds.toString();
        }
        alert("Modifier successfully updated! Refresh Page." + recipeStr);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.deleteModifier = function() {
      recipeAdjectiveService.deleteRecipeAdjective({_id: $scope.recipeAdjective._id}, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        res = res[0];
        var recipeStr = "";
        if(res.affectedRecipeIds && res.affectedRecipeIds.length > 0) {
          recipeStr += " Affected Recipe Ids: \n" + res.affectedRecipeIds.toString();
        }
        alert("Modifier successfully deleted! Refresh page." + recipeStr);
        $window.location.reload(true);
      }, function(response) {
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.noServerSelected = function() {
      return !$scope.useDevServer && !$scope.useProdServer;
    };
  }]);
