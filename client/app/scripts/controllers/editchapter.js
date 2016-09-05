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
    
    chapterService.getAllChapters().then(function(res) {
      $scope.chapters = res.data;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });

    lessonService.getLessonsForChapterConstruction().then(function(res) {
      $scope.lessons = res.lessons;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });

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

    $scope.saveChanges = function() {
      chapterService.updateChapter({
        name: $scope.chapter.name,
        description: $scope.chapter.description,
        lessonIds: $scope.chapter.lessonIds,
        timeEstimate: $scope.chapterTimeEstimate,
        _id: $scope.chapter._id
      }).then(function(res) {
        alert("Chapter successfully updated! Refresh page.");
        $window.location.reload(true);
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
        $window.location.reload(true);
      });
    };

    $scope.deleteChapter = function() {
      chapterService.deleteChapter({_id: $scope.chapter._id}).then(function(res) {
        alert("Chapter successfully deleted! Refresh page.");
        $window.location.reload(true);
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
        $window.location.reload(true);
      });
    };
  }]);
