'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditlessonsCtrl
 * @description
 * # EditlessonsCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditLessonsCtrl', ['$window', '$scope', 'lessonService', 'articleService', 'dailyTipsService', 'glossaryService', 'trainingVideosService', 'howToShopService', function ($window, $scope, lessonService, articleService, dailyTipsService, glossaryService, trainingVideosService, howToShopService) {
    $scope.itemTypes = ['tip', 'glossary', 'howToShop', 'trainingVideo'];

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadLessons = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      lessonService.getAllLessons(isProd).then(function(res) {
        $scope.lessons = res.data;
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });

      articleService.getArticlesTitleId(isProd).then(function(res) {
        $scope.articles = res.data;
      }, function(response) {
        alert("Server Error - see console logs for details");
        console.log("error response: ", response);
      });
      //need to fetch other items... will fetch whole things
      dailyTipsService.getAllDailyTips(isProd).then(function(res) {
        $scope.tips = res.data;
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });
      glossaryService.getAllGlossaryEntries(isProd).then(function(res) {
        $scope.glossaryEntries = res.data;
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });
      trainingVideosService.getAllTrainingVideos(isProd).then(function(res) {
        $scope.trainingVideos = res.data;
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });
      howToShopService.getAllHowToShopEntries(isProd).then(function(res) {
        $scope.howToShopEntries = res.data;
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });
    };

    $scope.reloadLessons('DEVELOPMENT');

    
    $scope.changeSelectedLesson = function() {
      if($scope.selectedLesson) {
        $scope.lesson = angular.copy($scope.selectedLesson);
      }
    };

    $scope.addItem = function() {
      $scope.lesson.itemIds.push({
        id: $scope.selectedItem,
        type: $scope.itemType
      });
    };

    $scope.canAddAllForItemType = function() {
      if($scope.lesson) {
        if(!$scope.lesson.isArticle && ($scope.itemType && $scope.itemType !== "")) {
          return true;
        }
        return false;
      }
      return false;
    };

    $scope.addAllOfItemType = function() {
      var typeArray = $scope.getSelectedTypeItems();
      for (var i = typeArray.length - 1; i >= 0; i--) {
        $scope.lesson.itemIds.push({
          id: typeArray[i]._id,
          type: $scope.itemType
        });
      }
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

    $scope.noServerSelected = function() {
      return !$scope.useDev && !$scope.useProd;
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
      }, $scope.useProd, $scope.useDev).then(function(res) {
        alert("Lesson successfully updated! Refresh page.");
        $window.location.reload(true);
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
        $window.location.reload(true);
      });
    };

    $scope.deleteLesson = function() {
      lessonService.deleteLesson({_id: $scope.lesson._id}, $scope.useProd, $scope.useDev).then(function(res) {
        var chapterStr = "";
        //could probably be a little more thorough on below and w/ alert...
        res = res[0];
        if(res.affectedChapterIds && res.affectedChapterIds.length > 0) {
          chapterStr += " Affected ChapterIds: \n" + res.affectedChapterIds.toString();
        }
        alert("Lesson successfully deleted. Refresh page." + chapterStr);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

  }]);
