'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditarticlesCtrl
 * @description
 * # EditarticlesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditArticlesCtrl', ['$scope', 'articleService', 'dailyTipsService', 'glossaryService', 'trainingVideosService', 'howToShopService', function ($scope, articleService, dailyTipsService, glossaryService, trainingVideosService, howToShopService) {
    
    articleService.getAllArticles().then(function(res) {
      $scope.articles = res.data;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });

    dailyTipsService.getAllDailyTips().then(function(data) {
      $scope.tips = data.data;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });

    glossaryService.getAllGlossaryEntries().then(function(data) {
      $scope.glossaryEntries = data.data;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });

    trainingVideosService.getAllTrainingVideos().then(function(data) {
      $scope.trainingVideos = data.data;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });

    howToShopService.getAllHowToShopEntries().then(function(data) {
      $scope.howToShopEntries = data.data;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });

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

    $scope.saveChanges = function() {
      articleService.updateArticle({
        title: $scope.article.title,
        contentSections: $scope.article.contentSections,
        _id: $scope.article._id
      }).then(function(res) {
        alert("Article successfully updated! Refresh page.");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.deleteArticle = function() {
      articleService.deleteArticle({
        _id: $scope.article._id
      }).then(function(res) {
        alert("Article successfully deleted! Refresh page.");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

  }]);
