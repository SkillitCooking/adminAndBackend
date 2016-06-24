'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:ItemcollectionsCtrl
 * @description
 * # ItemcollectionsCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('ItemcollectionsCtrl', ['$scope', 'itemCollectionService', function ($scope, itemCollectionService) {
    
    $scope.itemCollection = {};
    $scope.itemTypes = ["dailyTip", "trainingVideo", "howToShop", "glossary"];

    $scope.reset = function() {
      $scope.itemCollection = angular.copy({});
      $scope.itemCollectionsForm.$setPristine();
      $scope.itemCollectionsForm.$setUntouched();
    };

    $scope.save = function() {
      itemCollectionService.addNewItemCollection({
        itemCollection: {
          name: $scope.itemCollection.name,
          description: $scope.itemCollection.description,
          itemType: $scope.itemCollection.itemType
        }
      }).then(function(collection) {
        console.log("collection: ", collection);
        var alertMsg = "Success! Item Collection " + collection.data.name + " was saved!";
        alert(alertMsg);
      }); 
      $scope.reset();
    };
  }]);
