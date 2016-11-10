'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:ItemcollectionsCtrl
 * @description
 * # ItemcollectionsCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('ItemcollectionsCtrl', ['$window', '$scope', 'itemCollectionService', function ($window, $scope, itemCollectionService) {
    
    $scope.integerval = /^\d*$/;
    $scope.itemCollection = {};
    $scope.itemTypes = ["dailyTip", "trainingVideo", "howToShop", "glossary", "recipe"];

    $scope.reset = function() {
      $window.location.reload(true);
    };

    $scope.noServerSelected = function() {
      return !$scope.useProdServer && !$scope.useDevServer;
    };

    $scope.save = function() {
      if(!$scope.itemCollection.orderPreference) {
        //some signal
        $scope.itemCollection.orderPreference = -1;
      }
      itemCollectionService.addNewItemCollection({
        itemCollection: {
          name: $scope.itemCollection.name,
          description: $scope.itemCollection.description,
          itemType: $scope.itemCollection.itemType,
          pictureURL: $scope.itemCollection.pictureURL,
          orderPreference: $scope.itemCollection.orderPreference,
          isBYOCollection: $scope.itemCollection.isBYOCollection,
        }
      }, $scope.useProdServer, $scope.useDevServer).then(function(collection) {
        //below could be better/more thorough
        collection = collection[0];
        var alertMsg = "Success! Item Collection " + collection.data.name + " was saved!";
        alert(alertMsg);
        $scope.reset();
      }, function(response) {
        console.log('Server Error: ', response);
        alert("Server Error: ", response);
        $scope.reset();
      }); 
    };
  }]);
