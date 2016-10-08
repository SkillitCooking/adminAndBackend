'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:GlossaryentriesCtrl
 * @description
 * # GlossaryentriesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('GlossaryentriesCtrl', ['$window', '$scope', 'glossaryService', 'itemCollectionService', function ($window, $scope, glossaryService, itemCollectionService) {
    
    itemCollectionService.getItemCollectionsForType('glossary').then(function(collections) {
      $scope.glossaryCollections = collections.data;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

    $scope.glossaryEntry = {
      picture: {},
      video: {},
      collectionIds: []
    };

    $scope.curCollectionId = "";

    $scope.addCollection = function() {
      if($scope.curCollectionId && $scope.curCollectionId !== "") {
        $scope.glossaryEntry.collectionIds.push($scope.curCollectionId);
        $scope.curCollectionId = "";
      }
    };

    $scope.removeCollection = function(index) {
      $scope.glossaryEntry.collectionIds.splice(index, 1);
    };

    $scope.reset = function () {
      $window.location.reload(true);
    };

    $scope.save = function() {
      glossaryService.addNewGlossaryEntry({
        glossaryEntry: {
          title: $scope.glossaryEntry.title,
          text: $scope.glossaryEntry.text,
          picture: $scope.glossaryEntry.picture,
          video: $scope.glossaryEntry.video,
          collectionIds: $scope.glossaryEntry.collectionIds
        }
      }).then(function(entry) {
        var alertMsg = "Success! Tip " + entry.data.title + " was saved!";
        alert(alertMsg);
        $scope.reset();
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $scope.reset();
      });
    };

    $scope.glossaryEntrySanityCheck = function() {
      if($scope.glossaryEntry.collectionIds && $scope.glossaryEntry.collectionIds.length > 0) {
        if($scope.glossaryEntry.picture.url && $scope.glossaryEntry.video.videoId) {
          return true;
        } else if($scope.glossaryEntry.picture.url) {
          if($scope.glossaryEntry.video.caption && $scope.glossaryEntry.video.caption !== ""){
            return false;
          } else {
            return true;
          }
        } else if($scope.glossaryEntry.video.videoId) {
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
      } else {
        return false;
      }
    };

  }]);
