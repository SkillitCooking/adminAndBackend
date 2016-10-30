'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:TrainingvideosCtrl
 * @description
 * # TrainingvideosCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('TrainingvideosCtrl', ['$window', '$scope', 'trainingVideosService', 'itemCollectionService', function ($window, $scope, trainingVideosService, itemCollectionService) {

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadCollections = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      itemCollectionService.getItemCollectionsForType('trainingVideo', isProd).then(function(collections) {
        $scope.trainingVideoCollections = collections.data;
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadCollections('DEVELOPMENT');

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
      $window.location.reload(true);
    };

    $scope.save = function() {
      trainingVideosService.addNewTrainingVideo({
        trainingVideo: {
          title: $scope.trainingVideo.title,
          video: $scope.trainingVideo.video,
          picture: $scope.trainingVideo.picture,
          collectionIds: $scope.trainingVideo.collectionIds
        }
      }, $scope.useProdServer, $scope.useDevServer).then(function(video) {
        //below could be more thorough
        video = video[0];
        var alertMsg = "Success! Video " + video.data.title + " was saved!";
        alert(alertMsg);
        $scope.reset();
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $scope.reset();
      });
    };

    $scope.trainingVideoSanityCheck = function() {
      if(!$scope.useProdServer && !$scope.useDevServer) {
        return false;
      }
      //if video caption, then must be url
      if(($scope.trainingVideo.video.videoId && $scope.trainingVideo.video.videoId !== "") && 
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
