'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditglossaryentriesCtrl
 * @description
 * # EditglossaryentriesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditGlossaryEntriesCtrl', ['$window', '$scope', 'glossaryService', 'itemCollectionService', function ($window, $scope, glossaryService, itemCollectionService) {

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadStuff = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      glossaryService.getAllGlossaryEntries(isProd).then(function(res) {
        $scope.glossaryEntries = res.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });

      itemCollectionService.getItemCollectionsForType('glossary', isProd).then(function(collections) {
        $scope.glossaryCollections = collections.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadStuff('DEVELOPMENT');

    $scope.changeSelectedEntry = function() {
      if($scope.selectedEntry) {
        $scope.entry = angular.copy($scope.selectedEntry);
      }
    };

    $scope.removeCollection = function(index) {
      $scope.entry.collectionIds.splice(index, 1);
    };

    $scope.addCollection = function() {
      $scope.entry.collectionIds.push($scope.curCollectionId);
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedEntry();
    };

    $scope.saveChanges = function() {
      glossaryService.updateGlossaryEntry({
        title: $scope.entry.title,
        text: $scope.entry.text,
        picture: $scope.entry.picture,
        video: $scope.entry.video,
        collectionIds: $scope.entry.collectionIds,
        _id: $scope.entry._id
      }, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        var articleStr = "";
        //could be more thorough below
        res = res[0];
        if(res.affectedArticleIds && res.affectedArticleIds.length > 0) {
          articleStr = " Affected Articles that referenced Tip: \n" + res.affectedArticleIds.toString();
        }
        alert("Glossary Entry successfully updated! Refresh page." + articleStr);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.deleteGlossary = function() {
      glossaryService.deleteGlossaryEntry({_id: $scope.entry._id}, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        var extraText = "";
        //could be more thorough below
        res = res[0];
        if(res.affectedArticleIds && res.affectedArticleIds.length > 0) {
          extraText += " Affected ArticleIds: \n" + res.affectedArticleIds.toString() + "\n";
        }
        if(res.affectedLessonIds && res.affectedLessonIds.length > 0) {
          extraText += " Affected LessonIds: \n" + res.affectedLessonIds.toString();
        }
        alert("Glossary Entry successfully deleted! Refresh page" + extraText);
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
