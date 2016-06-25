'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:GlossaryentriesCtrl
 * @description
 * # GlossaryentriesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('GlossaryentriesCtrl', ['$scope', 'glossaryService', 'itemCollectionService', function ($scope, glossaryService, itemCollectionService) {
    
    itemCollectionService.getItemCollectionsForType('glossary').then(function(collections) {
      $scope.glossaryCollections = collections.data;
    }, function(response) {
      console.log("Server Error: ", response.message);
      alert("Server Error: " + response.message);
    });

    $scope.glossaryEntry = {
      picture: {},
      video: {}
    };

    $scope.reset = function () {
      $scope.glossaryEntry = angular.copy({picture:{}, video: {}});
      $scope.glossaryEntryForm.$setPristine();
      $scope.glossaryEntryForm.$setUntouched();
    };

    $scope.save = function() {
      glossaryService.addNewGlossaryEntry({
        glossaryEntry: {
          title: $scope.glossaryEntry.title,
          text: $scope.glossaryEntry.text,
          picture: $scope.glossaryEntry.picture,
          video: $scope.glossaryEntry.video,
          collectionId: $scope.glossaryEntry.collectionId
        }
      }).then(function(entry) {
        var alertMsg = "Success! Tip " + entry.data.title + " was saved!";
        alert(alertMsg);
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
      });
      $scope.reset();
    };

    $scope.glossaryEntrySanityCheck = function() {
      if($scope.glossaryEntry.picture.url && $scope.glossaryEntry.video.url) {
        return true;
      } else if($scope.glossaryEntry.picture.url) {
        if($scope.glossaryEntry.video.caption && $scope.glossaryEntry.video.caption !== ""){
          return false;
        } else {
          return true;
        }
      } else if($scope.glossaryEntry.video.url) {
        if($scope.glossaryEntry.picture.caption && $scope.glossaryEntry.picture.caption !== "") {
          return false;
        } else {
          return true;
        }
      } else {
        if(($scope.glossaryEntry.video.caption && $scope.glossaryEntry.video.caption !== "") || 
          ($scope.glossaryEntry.picture.caption && $scope.glossaryEntry.picture.caption !== "")){
          return false;
        } else {
          return true;
        }
      }
    };

  }]);
