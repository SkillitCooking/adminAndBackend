'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditglossaryentriesCtrl
 * @description
 * # EditglossaryentriesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditGlossaryEntriesCtrl', ['$scope', 'glossaryService', 'itemCollectionService', function ($scope, glossaryService, itemCollectionService) {
    
    glossaryService.getAllGlossaryEntries().then(function(res) {
      $scope.glossaryEntries = res.data;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

    itemCollectionService.getItemCollectionsForType('glossary').then(function(collections) {
      $scope.glossaryCollections = collections.data;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

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
      }).then(function(res) {
        var articleStr = "";
        if(res.affectedArticleIds && res.affectedArticleIds.length > 0) {
          articleStr = " Affected Articles that referenced Tip: \n" + res.affectedArticleIds.toString();
        }
        alert("Glossary Entry successfully updated! Refresh page." + articleStr);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.deleteGlossary = function() {
      glossaryService.deleteGlossaryEntry({_id: $scope.entry._id}).then(function(res) {
        var extraText = "";
        if(res.affectedArticleIds && res.affectedArticleIds.length > 0) {
          extraText += " Affected ArticleIds: \n" + res.affectedArticleIds.toString() + "\n";
        }
        if(res.affectedLessonIds && res.affectedLessonIds.length > 0) {
          extraText += " Affected LessonIds: \n" + res.affectedLessonIds.toString();
        }
        alert("Glossary Entry successfully deleted! Refresh page" + extraText);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

  }]);
