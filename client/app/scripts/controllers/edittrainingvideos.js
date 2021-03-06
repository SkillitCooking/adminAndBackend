'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EdittrainingvideosCtrl
 * @description
 * # EdittrainingvideosCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditTrainingVideosCtrl', ['$window', '$scope', 'trainingVideosService', 'itemCollectionService', function ($window, $scope, trainingVideosService, itemCollectionService) {

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadStuff = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
        trainingVideosService.getAllTrainingVideos(isProd).then(function(res) {
        $scope.videos = res.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });

      itemCollectionService.getItemCollectionsForType('trainingVideo', isProd).then(function(collections) {
        $scope.trainingVideoCollections = collections.data;
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadStuff('DEVELOPMENT');

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
      }, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        //below could be better
        res = res[0];
        var articleStr = "";
        if(res.affectedArticleIds && res.affectedArticleIds.length > 0) {
          articleStr = " Affected Articles that referenced Tip: \n" + res.affectedArticleIds.toString();
        }
        alert("Video updated successfully! Refresh page." + articleStr);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.deleteVideo = function() {
      trainingVideosService.deleteTrainingVideo({_id: $scope.trainingVideo._id}, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        var extraText = "";
        //below could be better/more thorough
        res = res[0];
        if(res.affectedArticleIds && res.affectedArticleIds.length > 0) {
          extraText += " Affected ArticleIds: \n" + res.affectedArticleIds.toString() + "\n";
        }
        if(res.affectedLessonIds && res.affectedLessonIds.length > 0) {
          extraText += " Affected LessonIds: \n" + res.affectedLessonIds.toString();
        }
        alert("Video successfully deleted! Refresh page." + extraText);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.noServerSelected = function() {
      return !$scope.useProdServer && !$scope.useDevServer;
    };
  }]);
