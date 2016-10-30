'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EdithowtoshopentriesCtrl
 * @description
 * # EdithowtoshopentriesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditHowToShopEntriesCtrl', ['$window', '$scope', 'howToShopService', 'itemCollectionService', function ($window, $scope, howToShopService, itemCollectionService) {

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadStuff = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      howToShopService.getAllHowToShopEntries(isProd).then(function(res) {
        $scope.howToShopEntries = res.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });

      itemCollectionService.getItemCollectionsForType('howToShop', isProd).then(function(collections) {
        $scope.howToShopCollections = collections.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadStuff('DEVELOPMENT');

    $scope.changeSelectedEntry = function() {
      if($scope.selectedEntry) {
        $scope.howToShopEntry = angular.copy($scope.selectedEntry);
      }
    };

    $scope.removePicture = function(index) {
      $scope.howToShopEntry.pictures.splice(index, 1);
    };

    $scope.addPicture = function() {
      $scope.howToShopEntry.pictures.push({});
    };

    $scope.removeCollection = function(index) {
      $scope.howToShopEntry.collectionIds.splice(index, 1);
    };

    $scope.addCollection = function() {
      $scope.howToShopEntry.collectionIds.push($scope.curCollectionId);
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedEntry();
    };

    $scope.saveChanges = function() {
      howToShopService.updateHowToShopEntry({
        title: $scope.howToShopEntry.title,
        text: $scope.howToShopEntry.text,
        pictures: $scope.howToShopEntry.pictures,
        collectionIds: $scope.howToShopEntry.collectionIds,
        _id: $scope.howToShopEntry._id
      }, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        var articleStr = "";
        //could be more thorough below
        res = res[0];
        if(res.affectedArticleIds && res.affectedArticleIds.length > 0) {
          articleStr = " Affected Articles that referenced Tip: \n" + res.affectedArticleIds.toString();
        }
        alert("Entry successfully updated. Refresh page." + articleStr);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.deleteEntry = function() {
      howToShopService.deleteHowToShopEntry({_id: $scope.howToShopEntry._id}, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        var extraText = "";
        //below could be more thorough
        res = res[0];
        if(res.affectedArticleIds && res.affectedArticleIds.length > 0) {
          extraText += " Affected ArticleIds: \n" + res.affectedArticleIds.toString() + "\n";
        }
        if(res.affectedLessonIds && res.affectedLessonIds.length > 0) {
          extraText += " Affected LessonIds: \n" + res.affectedLessonIds.toString();
        }
        alert("Entry successfully deleted. Refresh page." + extraText);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.noServerSelected = function() {
      return !$scope.useProdServer && !$scope.useDevServer;
    };
  }]);
