'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditdailytipsCtrl
 * @description
 * # EditdailytipsCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditDailytipsCtrl', ['$scope', 'dailyTipsService', 'itemCollectionService', function ($scope, dailyTipsService, itemCollectionService) {
    
    dailyTipsService.getAllDailyTips().then(function(res) {
      $scope.tips = res.data;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

    itemCollectionService.getItemCollectionsForType('dailyTip').then(function(res) {
      $scope.tipCollections = res.data;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

    $scope.changeSelectedTip = function() {
      if($scope.selectedTip) {
        $scope.dailyTip = angular.copy($scope.selectedTip);
      }
    };

    $scope.removeCollection = function(index) {
      $scope.dailyTip.collectionIds.splice(index, 1);
    };

    $scope.addCollection = function() {
      $scope.dailyTip.collectionIds.push($scope.curCollectionId);
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedTip();
    };

    $scope.saveChanges = function() {
      dailyTipsService.updateDailyTip({
        title: $scope.dailyTip.title,
        text: $scope.dailyTip.text,
        picture: $scope.dailyTip.picture,
        video: $scope.dailyTip.video,
        collectionIds: $scope.dailyTip.collectionIds,
        hasBeenDailyTip: $scope.dailyTip.hasBeenDailyTip,
        isTipOfTheDay: $scope.dailyTip.isTipOfTheDay,
        _id: $scope.dailyTip._id
      }).then(function(res) {
        alert("DailyTip successfully updated! Refresh page.");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.deleteDailyTip = function() {
      dailyTipsService.deleteDailyTip({_id: $scope.dailyTip._id}).then(function(res) {
        alert("DailyTip successfully deleted! Refresh page.");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };
  }]);
