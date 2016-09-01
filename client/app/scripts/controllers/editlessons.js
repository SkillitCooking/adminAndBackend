'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditlessonsCtrl
 * @description
 * # EditlessonsCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditLessonsCtrl', ['$scope', 'lessonService', 'articleService', 'dailyTipsService', 'glossaryService', 'trainingVideosService', 'howToShopService', function ($scope, lessonService, articleService, dailyTipsService, glossaryService, trainingVideosService, howToShopService) {
    $scope.itemTypes = ['tip', 'glossary', 'howToShop', 'trainingVideo'];

    lessonService.getAllLessons().then(function(res) {
      $scope.lessons = res.data;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });

    articleService.getArticlesTitleId().then(function(res) {
      $scope.articles = res.data;
    }, function(response) {
      alert("Server Error - see console logs for details");
      console.log("error response: ", response);
    });
    //need to fetch other items... will fetch whole things
    dailyTipsService.getAllDailyTips().then(function(res) {
      $scope.tips = res.data;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });
    glossaryService.getAllGlossaryEntries().then(function(res) {
      $scope.glossaryEntries = res.data;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });
    trainingVideosService.getAllTrainingVideos().then(function(res) {
      $scope.trainingVideos = res.data;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });
    howToShopService.getAllHowToShopEntries().then(function(res) {
      $scope.howToShopEntries = res.data;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });    

    $scope.changeSelectedLesson = function() {
      if($scope.selectedLesson) {
        $scope.lesson = angular.copy($scope.selectedLesson);
      }
    };

    $scope.addItem = function() {
      console.log("itemType: ", $scope.itemType);
      $scope.lesson.itemIds.push({
        id: $scope.selectedItem,
        type: $scope.itemType
      });
      console.log('itemIds: ', $scope.lesson.itemIds);
    };

    $scope.getArticleLabel = function() {
      if($scope.lesson) {
        return $scope.lesson.isArticle;
      }
    };

    $scope.getItemLabel = function() {
      if($scope.lesson) {
        return !$scope.lesson.isArticle;
      }
    };

    $scope.getSelectedTypeItems = function() {
      switch($scope.itemType) {
        case 'tip':
          return $scope.tips;
        case 'glossary':
          return $scope.glossaryEntries;
        case 'howToShop':
          return $scope.howToShopEntries;
        case 'trainingVideo':
          return $scope.trainingVideos;
        default:
          return [];
      }
    };

    $scope.removeItemId = function(index) {
      $scope.lesson.itemIds.splice(index, 1);
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedLesson();
    };

    $scope.saveChanges = function() {
      lessonService.updateLesson({
        name: $scope.lesson.name,
        timeEstimate: $scope.lesson.timeEstimate,
        description: $scope.lesson.description,
        isArticle: $scope.lesson.isArticle,
        articleId: $scope.lesson.articleId,
        itemIds: $scope.lesson.itemIds,
        _id: $scope.lesson._id
      }).then(function(res) {
        alert("Lesson successfully updated! Refresh page.");
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });
    };

    $scope.deleteLesson = function() {
      lessonService.deleteLesson({_id: $scope.lesson._id}).then(function(res) {
        alert("Lesson successfully deleted. Refresh page.");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

  }]);
