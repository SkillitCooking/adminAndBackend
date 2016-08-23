'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EdititemcollectionsCtrl
 * @description
 * # EdititemcollectionsCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditItemCollectionsCtrl', ['$scope', 'itemCollectionService', function ($scope, itemCollectionService) {

    $scope.itemTypes = $scope.itemTypes = ["dailyTip", "trainingVideo", "howToShop", "glossary", "recipe"];

    itemCollectionService.getAllItemCollections().then(function(res) {
      var groupedCollections = res.data;
      $scope.collections = [];
      for(var key in groupedCollections) {
        var group = groupedCollections[key];
        for (var i = group.length - 1; i >= 0; i--) {
          group[i].displayName = group[i].name + " -- " + key;
          $scope.collections.push(group[i]);
        }
      }
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

    $scope.changeSelectedCollection = function() {
      if($scope.selectedCollection) {
        $scope.itemCollection = angular.copy($scope.selectedCollection);
      }
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedCollection();
    };

    $scope.saveChanges = function() {
      itemCollectionService.updateItemCollection({
        name: $scope.itemCollection.name,
        description: $scope.itemCollection.description,
        itemType: $scope.itemCollection.itemType,
        _id: $scope.itemCollection._id
      }).then(function(res) {
        alert("ItemCollection successfully updated! Refresh page.");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.deleteCollection = function() {
      itemCollectionService.deleteItemCollection({_id: $scope.itemCollection._id}).then(function(res) {
        alert("ItemCollection successfully deleted! Refresh page.");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };
  }]);
