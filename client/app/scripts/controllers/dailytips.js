'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:DailytipsCtrl
 * @description
 * # DailytipsCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('DailytipsCtrl', ['$scope', 'dailyTipsService', 'itemCollectionService', function ($scope, dailyTipsService, itemCollectionService) {
    
    itemCollectionService.getItemCollectionsForType('dailyTip').then(function(collections) {
      $scope.tipCollections = collections.data;
    }, function(response) {
      console.log("Server Error: ", response.message);
      alert("Server Error: " + response.message);
    });

    $scope.dailyTip = {
      picture: {},
      video: {},
      collectionIds: []
    };
    $scope.curCollectionId = "";

    $scope.removeCollection = function(index) {
      $scope.dailyTip.collectionIds.splice(index, 1);
    };

    $scope.addCollection = function() {
      if($scope.curCollectionId && $scope.curCollectionId !== "") {
        $scope.dailyTip.collectionIds.push($scope.curCollectionId);
        $scope.curCollectionId = "";
      }
    };

    $scope.reset = function() {
      $scope.dailyTip = angular.copy({picture:{}, video: {}, collectionIds: []});
      $scope.dailyTipsForm.$setPristine();
      $scope.dailyTipsForm.$setUntouched();
    };

    $scope.save = function() {
      dailyTipsService.addNewDailyTip({
        dailyTip: {
          title: $scope.dailyTip.title,
          text: $scope.dailyTip.text,
          picture: $scope.dailyTip.picture,
          video: $scope.dailyTip.video,
          collectionIds: $scope.dailyTip.collectionIds,
          hasBeenDailyTip: false,
          isTipOfTheDay: false
        }
      }).then(function(tip) {
        var alertMsg = "Success! Tip " + tip.data.title + " was saved!";
        alert(alertMsg);
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
      });
      $scope.reset();
    };

    $scope.dailyTipSanityCheck = function() {
      if($scope.dailyTip.collectionIds && $scope.dailyTip.collectionIds.length > 0) {
        if($scope.dailyTip.picture.url && $scope.dailyTip.video.url) {
          return true;
        } else if($scope.dailyTip.picture.url) {
          if($scope.dailyTip.video.caption && $scope.dailyTip.video.caption !== ""){
            return false;
          } else {
            return true;
          }
        } else if($scope.dailyTip.video.url) {
          if($scope.dailyTip.picture.caption && $scope.dailyTip.picture.caption !== "") {
            return false;
          } else {
            return true;
          }
        } else {
          if(($scope.dailyTip.video.caption && $scope.dailyTip.video.caption !== "") || 
            ($scope.dailyTip.picture.caption && $scope.dailyTip.picture.caption !== "")){
            return false;
          } else {
            return true;
          }
        }
      } else {
        return false;
      }
    };

  }]);
