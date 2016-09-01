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
        var articleStr = "";
        if(res.affectedArticleIds && res.affectedArticleIds.length > 0) {
          articleStr = " Affected Articles that referenced Tip: \n" + res.affectedArticleIds.toString();
        }
        alert("Video updated successfully! Refresh page." + articleStr);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.deleteVideo = function() {
      trainingVideosService.deleteTrainingVideo({_id: $scope.trainingVideo._id}).then(function(res) {
        var extraText = "";
        if(res.affectedArticleIds && res.affectedArticleIds.length > 0) {
          extraText += " Affected ArticleIds: \n" + res.affectedArticleIds.toString() + "\n";
        }
        if(res.affectedLessonIds && res.affectedLessonIds.length > 0) {
          extraText += " Affected LessonIds: \n" + res.affectedLessonIds.toString();
        }
        alert("Video successfully deleted! Refresh page." + extraText);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };
  }]);
