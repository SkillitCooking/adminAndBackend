'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:ChapterCtrl
 * @description
 * # ChapterCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('ChapterCtrl', ['$window', '$scope', 'lessonService', 'chapterService', function ($window, $scope, lessonService, chapterService) {
    $scope.serverType = 'DEVELOPMENT';

    $scope.integerval = /^\d*$/;

    $scope.reloadLessons = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      lessonService.getLessonsForChapterConstruction(isProd).then(function(data) {
        $scope.lessons = data.lessons;
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });
    };

    $scope.reloadLessons('DEVELOPMENT');

    //get lessons - need name, id, timeEstimate

    $scope.chapter = {};

    $scope.timeEstimates = [];

    $scope.addLesson = function() {
      if(!$scope.chapter.lessonIds) {
        $scope.chapter.lessonIds = [];
      }
      $scope.timeEstimates.push($scope.selectedLesson.timeEstimate);
      $scope.chapter.lessonIds.push($scope.selectedLesson._id);
    };

    $scope.removeLesson = function(index) {
      $scope.timeEstimates.splice(index, 1);
      $scope.chapter.lessonIds.splice(index, 1);
    };

    $scope.save = function() {
      var totalTimeEstimate = $scope.timeEstimates.reduce(function(a, b) {
        return parseInt(a, 10) + parseInt(b, 10);
      });
      chapterService.addNewChapter({
        name: $scope.chapter.name,
        description: $scope.chapter.description,
        lessonIds: $scope.chapter.lessonIds,
        timeEstimate: totalTimeEstimate,
        pictureURL: $scope.chapter.pictureURL
      }, $scope.useProdServer, $scope.useDevServer).then(function(data) {
        var chapter = data[0].data;
        var alertMsg = "Success! Chapter " + chapter.name + " was saved!";
        alert(alertMsg);
        $scope.reset();
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
        $scope.reset();
      });
    };

    $scope.reset = function() {
      $window.location.reload(true);
    };

    $scope.noServerSelected = function() {
      return !$scope.useDevServer && !$scope.useProdServer;
    };

    //saving will involve timeEstimate calculation...

  }]);
