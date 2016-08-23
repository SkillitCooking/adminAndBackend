'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EdithowtoshopentriesCtrl
 * @description
 * # EdithowtoshopentriesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditHowToShopEntriesCtrl', ['$scope', 'howToShopService', 'itemCollectionService', function ($scope, howToShopService, itemCollectionService) {
    
    howToShopService.getAllHowToShopEntries().then(function(res) {
      $scope.howToShopEntries = res.data;
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
      }).then(function(res) {
        alert("Entry successfully updated. Refresh page");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.deleteEntry = function() {
      howToShopService.deleteHowToShopEntry({_id: $scope.howToShopEntry._id}).then(function(res) {
        alert("Entry successfully deleted. Refresh page");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };
  }]);
