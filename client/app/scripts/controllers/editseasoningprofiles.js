'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditseasoningprofilesCtrl
 * @description
 * # EditseasoningprofilesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditSeasoningProfilesCtrl', ['$scope', 'seasoningService', function ($scope, seasoningService) {
    seasoningService.getAllSeasonings().then(function(res) {
      $scope.seasonings = res.data;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

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
        spices: $scope.seasoningProfile.spices,
        _id: $scope.seasoningProfile._id
      }).then(function(res) {
        var recipeStr = "";
        if(res.affectedRecipeIds && res.affectedRecipeIds.length > 0) {
          recipeStr += " Affected Recipe Ids: \n" + res.affectedRecipeIds.toString();
        }
        alert("Seasoning successfully updated! Refresh page." + recipeStr);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.deleteSeasoningProfile = function() {
      seasoningService.deleteSeasoning({_id: $scope.seasoningProfile._id}).then(function(res) {
        var recipeStr = "";
        if(res.affectedRecipeIds && res.affectedRecipeIds.length > 0) {
          recipeStr += " Affected Recipe Ids: \n" + res.affectedRecipeIds.toString();
        }
        alert("Seasoning successfully deleted! Refresh page." + recipeStr);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

  }]);
