'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:ArticleCtrl
 * @description
 * # ArticleCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('ArticleCtrl', ['$window', '$scope', 'articleService', 'dailyTipsService', 'glossaryService', 'trainingVideosService', 'howToShopService', function ($window, $scope, articleService, dailyTipsService, glossaryService, trainingVideosService, howToShopService) {

    //need to get all various items from their respective services here...
    //make sure names are correct
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

    $scope.contentSection = {};
    
    $scope.addContentSection = function() {
      if(!$scope.article.contentSections){
        $scope.article.contentSections = [];
      }
      console.log("contentSection", angular.copy($scope.contentSection));
      $scope.article.contentSections.push($scope.contentSection);
      $scope.contentSection = angular.copy({});
    };

    $scope.removeContentSection = function(index) {
      $scope.article.contentSections.splice(index, 1);
    };

    $scope.save = function() {
      articleService.addNewArticle({
        title: $scope.article.title,
        contentSections: $scope.article.contentSections
      }).then(function(article) {
        article = article.data;
        var alertMsg = "Success! Article " + article.title + " was saved!";
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

    $scope.togglePreview = function() {
      $scope.showArticlePreview = !$scope.showArticlePreview;
    };

  }]);
