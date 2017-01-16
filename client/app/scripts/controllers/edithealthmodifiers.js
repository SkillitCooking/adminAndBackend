'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EdithealthmodifiersCtrl
 * @description
 * # EdithealthmodifiersCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EdithealthmodifiersCtrl', ['$window', '$scope', 'healthModifierService', function ($window, $scope, healthModifierService) {
    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadStuff = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      healthModifierService.getAllHealthModifiers(isProd).then(function(res) {
        console.log(res);
        $scope.modifiers = res.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadStuff('DEVELOPMENT');

    $scope.changeSelectedModifier = function() {
      if($scope.selectedModifier) {
        $scope.healthModifier = angular.copy($scope.selectedModifier);
      }
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedModifier();
    };

    $scope.saveChanges = function() {
      healthModifierService.updateHealthModifier({
        name: $scope.healthModifier.name
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
      healthModifierService.deleteModifier({_id: $scope.healthModifier._id}, $scope.useProdServer, $scope.useDevServer).then(function(res) {
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
