'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditseasoningprofilesCtrl
 * @description
 * # EditseasoningprofilesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditSeasoningProfilesCtrl', ['$window', '$scope', 'seasoningService', function ($window, $scope, seasoningService) {

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadProfiles = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      seasoningService.getAllSeasonings(isProd).then(function(res) {
        $scope.seasonings = res.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadProfiles('DEVELOPMENT');

    $scope.changeSelectedSeasoning = function() {
      if($scope.selectedSeasoning) {
        $scope.seasoningProfile = angular.copy($scope.selectedSeasoning);
      }
    };

    $scope.removeSpice = function(index) {
      $scope.seasoningProfile.spices.splice(index, 1);
    };

    $scope.addSpice = function() {
      $scope.seasoningProfile.spices.push("");
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedSeasoning();
    };

    $scope.saveChanges = function() {
      seasoningService.updateSeasoning({
        name: $scope.seasoningProfile.name,
        recipeTitleAlias: $scope.seasoningProfile.recipeTitleAlias,
        spices: $scope.seasoningProfile.spices,
        _id: $scope.seasoningProfile._id
      }, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        //below could be better/more thorough
        res = res[0];
        var recipeStr = "";
        if(res.affectedRecipeIds && res.affectedRecipeIds.length > 0) {
          recipeStr += " Affected Recipe Ids: \n" + res.affectedRecipeIds.toString();
        }
        alert("Seasoning successfully updated! Refresh page." + recipeStr);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.deleteSeasoningProfile = function() {
      seasoningService.deleteSeasoning({_id: $scope.seasoningProfile._id}, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        //below could be better
        res = res[0];
        var recipeStr = "";
        if(res.affectedRecipeIds && res.affectedRecipeIds.length > 0) {
          recipeStr += " Affected Recipe Ids: \n" + res.affectedRecipeIds.toString();
        }
        alert("Seasoning successfully deleted! Refresh page." + recipeStr);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.noServerSelected = function() {
      return !$scope.useDevServer && !$scope.useProdServer;
    };

  }]);
