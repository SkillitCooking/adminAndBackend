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

    $scope.serverType = 'DEVELOPMENT';

    $scope.contentSection = {};

    $scope.reloadEntries = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      //need to get all various items from their respective services here...
      //make sure names are correct
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
    
    $scope.addContentSection = function() {
      if(!$scope.article.contentSections){
        $scope.article.contentSections = [];
      }
      $scope.article.contentSections.push($scope.contentSection);
      $scope.contentSection = angular.copy({});
    };

    $scope.removeContentSection = function(index) {
      $scope.article.contentSections.splice(index, 1);
    };

    $scope.noServerSelected = function() {
      return !$scope.useProdServer && !$scope.useDevServer;
    };

    $scope.save = function() {
      articleService.addNewArticle({
        title: $scope.article.title,
        contentSections: $scope.article.contentSections
      }, $scope.useProdServer, $scope.useDevServer).then(function(articles) {
        var article = articles[0].data;
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
