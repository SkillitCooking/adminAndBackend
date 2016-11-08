'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditchapterCtrl
 * @description
 * # EditchapterCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditChapterCtrl', ['$window', '$scope', 'chapterService', 'lessonService', function ($window, $scope, chapterService, lessonService) {

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadStuff = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      chapterService.getAllChapters(isProd).then(function(res) {
        $scope.chapters = res.data;
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });

      lessonService.getLessonsForChapterConstruction(isProd).then(function(res) {
        $scope.lessons = res.lessons;
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });
    };

    $scope.reloadStuff('DEVELOPMENT');

    $scope.changeSelectedChapter = function() {
      if($scope.selectedChapter) {
        $scope.chapter = angular.copy($scope.selectedChapter);
        $scope.chapterTimeEstimate = parseInt($scope.chapter.timeEstimate, 10);
      }
    };

    $scope.addLesson = function() {
      $scope.chapterTimeEstimate += parseInt($scope.selectedLesson.timeEstimate);
      $scope.chapter.lessonIds.push($scope.selectedLesson._id);
    };

    //how you gonna get that lesson timeEstimate?
    //by _id matching
    $scope.removeLesson = function(index) {
      var lesson;
      for (var i = $scope.lessons.length - 1; i >= 0; i--) {
        if($scope.lessons[i]._id === $scope.chapter.lessonIds[index]) {
          lesson = $scope.lessons[i];
          break;
        }
      }
      if(lesson) {
        $scope.chapterTimeEstimate -= parseInt(lesson.timeEstimate, 10);
        $scope.chapter.lessonIds.splice(index, 1);
      } else {
        console.log("Lesson couldn't be found via id matching");
      }
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedChapter();
    };

    /*$scope.updateChapterTimeEstimate = function() {
      var lessonsToCompute = [];
      for (var i = $scope.lessons.length - 1; i >= 0; i--) {
        for (var j = $scope.chapter.lessonIds.length - 1; j >= 0; j--) {
          if($scope.chapter.lessonIds[j] === $scope.lessons[i]._id){
            lessonsToCompute.push($scope.lessons[i]);
          }
        }
      }
      console.log('lessons', lessonsToCompute);
      $scope.chapterTimeEstimate = lessonsToCompute.map(function(lesson) {
        return lesson.timeEstimate;
      }).reduce(function(a, b) {
        return parseInt(a, 10) + parseInt(b, 10);
      });
      console.log('estimate', $scope.chapterTimeEstimate);
    };*/

    $scope.saveChanges = function() {
      chapterService.updateChapter({
        name: $scope.chapter.name,
        description: $scope.chapter.description,
        lessonIds: $scope.chapter.lessonIds,
        timeEstimate: $scope.chapterTimeEstimate,
        pictureURL: $scope.chapter.pictureURL,
        _id: $scope.chapter._id
      }, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        alert("Chapter successfully updated! Refresh page.");
        $window.location.reload(true);
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
        $window.location.reload(true);
      });
    };

    $scope.deleteChapter = function() {
      chapterService.deleteChapter({_id: $scope.chapter._id}, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        alert("Chapter successfully deleted! Refresh page.");
        $window.location.reload(true);
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
        $window.location.reload(true);
      });
    };

    $scope.noServerSelected = function() {
      return !$scope.useDevServer && !$scope.useProdServer;
    };
  }]);
