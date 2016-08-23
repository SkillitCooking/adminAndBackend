'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EdittrainingvideosCtrl
 * @description
 * # EdittrainingvideosCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditTrainingVideosCtrl', ['$scope', 'trainingVideosService', 'itemCollectionService', function ($scope, trainingVideosService, itemCollectionService) {
    
    trainingVideosService.getAllTrainingVideos().then(function(res) {
      $scope.videos = res.data;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

    itemCollectionService.getItemCollectionsForType('trainingVideo').then(function(collections) {
      $scope.trainingVideoCollections = collections.data;
    }, function(response) {
      console.log("Server Error: ", response.message);
      alert("Server Error: " + response.message);
    });

    $scope.changeSelectedVideo = function() {
      if($scope.selectedVideo) {
        $scope.trainingVideo = angular.copy($scope.selectedVideo);
      }
    };

    $scope.removeCollection = function(index) {
      $scope.trainingVideo.collectionIds.splice(index, 1);
    };

    $scope.addCollection = function() {
      $scope.trainingVideo.collectionIds.push($scope.curCollectionId);
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedVideo();
    };

    $scope.saveChanges = function() {
      trainingVideosService.updateTrainingVideo({
        title: $scope.trainingVideo.title,
        video: $scope.trainingVideo.video,
        picture: $scope.trainingVideo.picture,
        collectionIds: $scope.trainingVideo.collectionIds,
        _id: $scope.trainingVideo._id
      }).then(function(res) {
        alert("Video updated successfully! Refresh page");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.deleteVideo = function() {
      trainingVideosService.deleteTrainingVideo({_id: $scope.trainingVideo._id}).then(function(res) {
        alert("Video successfully deleted! Refresh page");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };
  }]);
