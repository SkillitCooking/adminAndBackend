'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditarticlesCtrl
 * @description
 * # EditarticlesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditArticlesCtrl', ['$window', '$scope', 'articleService', 'dailyTipsService', 'glossaryService', 'trainingVideosService', 'howToShopService', function ($window, $scope, articleService, dailyTipsService, glossaryService, trainingVideosService, howToShopService) {

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadEntries = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      articleService.getAllArticles(isProd).then(function(res) {
        $scope.articles = res.data;
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });

      dailyTipsService.getAllDailyTips(isProd).then(function(data) {
        $scope.tips = data.data;
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });

      glossaryService.getAllGlossaryEntries(isProd).then(function(data) {
        $scope.glossaryEntries = data.data;
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });

      trainingVideosService.getAllTrainingVideos(isProd).then(function(data) {
        $scope.trainingVideos = data.data;
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });

      howToShopService.getAllHowToShopEntries(isProd).then(function(data) {
        $scope.howToShopEntries = data.data;
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
      });
    };

    $scope.reloadEntries('DEVELOPMENT');

    $scope.changeSelectedArticle = function() {
      //what needs to happen here?? At least copying selectedArticle into article...
      if($scope.selectedArticle) {
        $scope.article = angular.copy($scope.selectedArticle);
        $scope.contentSectionIndicatorArray = new Array($scope.article.contentSections.length);
        $scope.contentSectionIndicatorArray.fill(true);
      }
    };

    $scope.isMinimizedContentSection = function(index) {
      return $scope.contentSectionIndicatorArray[index];
    };

    $scope.removeContentSection = function(index) {
      $scope.article.contentSections.splice(index, 1);
      $scope.contentSectionIndicatorArray.splice(index, 1);
    };

    $scope.toggleContentSection = function(index) {
      $scope.contentSectionIndicatorArray[index] = !$scope.contentSectionIndicatorArray[index];
    };

    $scope.getContentSectionToggleText = function(index) {
      if($scope.contentSectionIndicatorArray[index]) {
        return 'Expand';
      } else {
        return 'Minimize';
      }
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedArticle();
    };

    $scope.noServerSelected = function() {
      return !$scope.useDevServer && !$scope.useProdServer;
    };

    $scope.saveChanges = function() {
      articleService.updateArticle({
        title: $scope.article.title,
        contentSections: $scope.article.contentSections,
        _id: $scope.article._id
      }, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        alert("Article successfully updated! Refresh page.");
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.deleteArticle = function() {
      articleService.deleteArticle({
        _id: $scope.article._id
      }, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        var lessonStr = "";
        //could probably be more thorough on below and alerts
        res = res[0];
        if(res.affectedLessonIds && res.affectedLessonIds.length > 0) {
          lessonStr += " Affected Lesson Ids: \n" + res.affectedLessonIds.toString();
        }
        alert("Article successfully deleted! Refresh page." + lessonStr);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

  }]);
