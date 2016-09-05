'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:LessonCtrl
 * @description
 * # LessonCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('LessonCtrl', ['$window', '$scope', 'articleService', 'dailyTipsService', 'glossaryService', 'howToShopService', 'trainingVideosService', 'lessonService', function ($window, $scope, articleService, dailyTipsService, glossaryService, howToShopService, trainingVideosService, lessonService) {
    //need to fetch articles - just id and title
    articleService.getArticlesTitleId().then(function(res) {
      $scope.lesson.articles = res.data;
      console.log('articles: ', $scope.lesson.articles);
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

    $scope.itemTypes = ['tip', 'glossary', 'howToShop', 'trainingVideo'];

    $scope.lesson = {
      itemIds: []
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

    $scope.addItem = function() {
      if(!$scope.lesson.itemIds) {
        $scope.lesson.itemIds = [];
      }
      $scope.lesson.itemIds.push({
        id: $scope.selectedItem,
        type: $scope.itemType
      });
    };

    $scope.canAddAllForItemType = function() {
      if(!$scope.lesson.isArticle && ($scope.itemType && $scope.itemType !== "")) {
        return true;
      }
      return false;
    };

    $scope.addAllOfItemType = function() {
      if(!$scope.lesson.itemIds) {
        $scope.lesson.itemIds = [];
      }
      var typeArray = $scope.getSelectedTypeItems();
      for (var i = typeArray.length - 1; i >= 0; i--) {
        $scope.lesson.itemIds.push({
          id: typeArray[i]._id,
          itemType: $scope.itemType
        });
      }
    };

    $scope.removeItemId = function(index) {
      $scope.lesson.itemIds.splice(index, 1);
    };

    $scope.save = function() {
      lessonService.addNewLesson({
        name: $scope.lesson.name,
        timeEstimate: $scope.lesson.timeEstimate,
        description: $scope.lesson.description,
        isArticle: $scope.lesson.isArticle,
        articleId: $scope.lesson.articleId,
        itemIds: $scope.lesson.itemIds
      }).then(function(data) {
        var lesson = data.data;
        var alertMsg = "Success! Lesson " + lesson.name + " was saved!";
        alert(alertMsg);
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });
      $scope.reset();
    };

    $scope.reset = function() {
      $window.location.reload(true);
    };

    $scope.getArticleLabel = function() {
      return $scope.lesson.isArticle;
    };

    $scope.getItemLabel = function() {
      return !$scope.lesson.isArticle;
    };

  }]);
