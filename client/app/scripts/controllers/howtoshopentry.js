'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:HowtoshopentryCtrl
 * @description
 * # HowtoshopentryCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('HowtoshopentryCtrl', ['$scope', 'howToShopService', 'itemCollectionService', function ($scope, howToShopService, itemCollectionService) {
    
    itemCollectionService.getItemCollectionsForType('howToShop').then(function(collections) {
      $scope.howToShopCollections = collections.data;
    }, function(response) {
      console.log("Server Error: ", response.message);
      alert("Server Error: " + response.message);
    });

    $scope.howToShopEntry = {};

    $scope.addPicture = function() {
      console.log("entry: ", $scope.howToShopEntry);
      if(!$scope.howToShopEntry.pictures) {
        console.log("no pics");
        $scope.howToShopEntry.pictures = [];
      }
      $scope.howToShopEntry.pictures.push({
        url: "",
        caption: ""
      });
    };

    $scope.removePicture = function() {
      if($scope.howToShopEntry.pictures && $scope.howToShopEntry.pictures.length > 0) {
        $scope.howToShopEntry.pictures.pop();
      }
    };

    $scope.reset = function() {
      $scope.howToShopEntry = angular.copy({pictures: []});
      $scope.howToShopEntryForm.$setPristine();
      $scope.howToShopEntryForm.$setUntouched();
    };

    $scope.save = function() {
      howToShopService.addNewHowToShopEntry({
        howToShopEntry: {
          title: $scope.howToShopEntry.title,
          text: $scope.howToShopEntry.text,
          pictures: $scope.howToShopEntry.pictures,
          collectionId: $scope.howToShopEntry.collectionId
        }
      }).then(function(entry) {
        var alertMsg = "Success! Entry " + entry.data.title + " was saved!";
        alert(alertMsg);
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
      });
      $scope.reset();
    };

    $scope.howToShopEntrySanityCheck = function() {
      //for each of pictures, make sure at least url
      for (var i = $scope.howToShopEntry.pictures.length - 1; i >= 0; i--) {
        if(!$scope.howToShopEntry.pictures[i].url || $scope.howToShopEntry.pictures[i].url === "") {
          return false;
        }
      }
      return true;
    };
  }]);
