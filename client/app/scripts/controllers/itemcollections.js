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
    
    $scope.itemCollection = {};
    $scope.itemTypes = ["dailyTip", "trainingVideo", "howToShop", "glossary", "recipe"];

    $scope.reset = function() {
      $window.location.reload(true);
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
        $scope.reset();
      }, function(response) {
        console.log('Server Error: ', response);
        alert("Server Error: ", response);
        $scope.reset();
      }); 
    };
  }]);
