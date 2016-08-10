'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:ArticleCtrl
 * @description
 * # ArticleCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('ArticleCtrl', ['$scope', 'articleService', 'dailyTipsService', 'glossaryService', 'trainingVideosService', 'howToShopService', function ($scope, articleService, dailyTipsService, glossaryService, trainingVideosService, howToShopService) {

    //need to get all various items from their respective services here...
    //make sure names are correct
    dailyTipsService.getAllDailyTips().then(function(data) {
      $scope.tips = data.tips;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });
    glossaryService.getAllGlossaryEntries().then(function(data) {
      $scope.glossaryEntries = data.entries;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });
    trainingVideosService.getAllTrainingVideos().then(function(data) {
      $scope.trainingVideos = data.videos;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });
    howToShopService.getAllHowToShopEntries().then(function(data) {
      $scope.howToShopEntries = data.entries;
    }, function(response) {
      alert("Server Error - check console logs for details");
      console.log("error response: ", response);
    });
    
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

    $scope.save = function() {
      articleService.addNewArticle({
        title: $scope.article.title,
        contentSections: $scope.article.contentSections
      }).then(function(article) {
        article = article.data;
        var alertMsg = "Success! Article " + article.title + " was saved!";
        alert(alertMsg);
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
      });
      $scope.reset();
    };

    $scope.reset = function() {
      $scope.contentSection = angular.copy({});
      $scope.article = angular.copy({});
      $scope.articleForm.$setPristine();
      $scope.articleForm.$setUntouched();
    };

    $scope.preview = function() {
      //go to new view
      
    };

  }]);
