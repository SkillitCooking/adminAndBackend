'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditdailytipsCtrl
 * @description
 * # EditdailytipsCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditDailytipsCtrl', ['$window', '$scope', 'dailyTipsService', 'itemCollectionService', function ($window, $scope, dailyTipsService, itemCollectionService) {

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadStuff = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      dailyTipsService.getAllDailyTips(isProd).then(function(res) {
        $scope.tips = res.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });

      itemCollectionService.getItemCollectionsForType('dailyTip', isProd).then(function(res) {
        $scope.tipCollections = res.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadStuff('DEVELOPMENT');

    $scope.changeSelectedTip = function() {
      if($scope.selectedTip) {
        $scope.dailyTip = angular.copy($scope.selectedTip);
      }
    };

    $scope.removeCollection = function(index) {
      $scope.dailyTip.collectionIds.splice(index, 1);
    };

    $scope.addCollection = function() {
      $scope.dailyTip.collectionIds.push($scope.curCollectionId);
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedTip();
    };

    $scope.saveChanges = function() {
      dailyTipsService.updateDailyTip({
        title: $scope.dailyTip.title,
        text: $scope.dailyTip.text,
        picture: $scope.dailyTip.picture,
        video: $scope.dailyTip.video,
        collectionIds: $scope.dailyTip.collectionIds,
        hasBeenDailyTip: $scope.dailyTip.hasBeenDailyTip,
        isTipOfTheDay: $scope.dailyTip.isTipOfTheDay,
        _id: $scope.dailyTip._id
      }, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        var articleStr = "";
        //below could be more thorough, representative on alert...
        res = res[0];
        if(res.affectedArticleIds && res.affectedArticleIds.length > 0) {
          articleStr = " Affected Articles that referenced Tip: \n" + res.affectedArticleIds.toString();
        }
        alert("DailyTip successfully updated! Refresh page." + articleStr);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.deleteDailyTip = function() {
      dailyTipsService.deleteDailyTip({_id: $scope.dailyTip._id}, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        var extraText = "";
        //below could be more thorough...
        res = res[0];
        if(res.affectedArticleIds && res.affectedArticleIds.length > 0) {
          extraText += " Affected ArticleIds: \n" + res.affectedArticleIds.toString() + "\n";
        }
        if(res.affectedLessonIds && res.affectedLessonIds.length > 0) {
          extraText += " Affected LessonIds: \n" + res.affectedLessonIds.toString();
        }
        alert("DailyTip successfully deleted! Refresh page." + extraText);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.noServerSelected = function() {
      return !$scope.useDevServer && !$scope.useProdServer;
    };
  }]);
