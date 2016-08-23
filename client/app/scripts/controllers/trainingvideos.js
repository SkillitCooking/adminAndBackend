'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:TrainingvideosCtrl
 * @description
 * # TrainingvideosCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('TrainingvideosCtrl', ['$scope', 'trainingVideosService', 'itemCollectionService', function ($scope, trainingVideosService, itemCollectionService) {
    
    itemCollectionService.getItemCollectionsForType('trainingVideo').then(function(collections) {
      $scope.trainingVideoCollections = collections.data;
    }, function(response) {
      console.log("Server Error: ", response.message);
      alert("Server Error: " + response.message);
    });

    $scope.trainingVideo = {
      video: {},
      picture: {},
      collectionIds: []
    };

    $scope.removeCollection = function(index) {
      $scope.trainingVideo.collectionIds.splice(index, 1);
    };

    $scope.addCollection = function() {
      if($scope.curCollectionId && $scope.curCollectionId !== "") {
        $scope.trainingVideo.collectionIds.push($scope.curCollectionId);
        $scope.curCollectionId = "";
      }
    };

    $scope.curCollectionId = "";

    $scope.reset = function() {
      $scope.trainingVideo = angular.copy({video: {}, picture: {}, collectionIds: []});
      $scope.trainingVideoForm.$setPristine();
      $scope.trainingVideoForm.$setUntouched();
    };

    $scope.save = function() {
      trainingVideosService.addNewTrainingVideo({
        trainingVideo: {
          title: $scope.trainingVideo.title,
          video: $scope.trainingVideo.video,
          picture: $scope.trainingVideo.picture,
          collectionIds: $scope.trainingVideo.collectionIds
        }
      }).then(function(video) {
        var alertMsg = "Success! Video " + video.data.title + " was saved!";
        alert(alertMsg);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
      $scope.reset();
    };

    $scope.trainingVideoSanityCheck = function() {
      //if video caption, then must be url
      if(($scope.trainingVideo.video.url && $scope.trainingVideo.video.url !== "") && 
        ($scope.trainingVideo.picture.url && $scope.trainingVideo.picture.url !== "")) {
        if($scope.trainingVideo.collectionIds && $scope.trainingVideo.collectionIds.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };
  }]);
