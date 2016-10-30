'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:HowtoshopentryCtrl
 * @description
 * # HowtoshopentryCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('HowtoshopentryCtrl', ['$window', '$scope', 'howToShopService', 'itemCollectionService', function ($window, $scope, howToShopService, itemCollectionService) {

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadCollections = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      itemCollectionService.getItemCollectionsForType('howToShop', isProd).then(function(collections) {
        $scope.howToShopCollections = collections.data;
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadCollections('DEVELOPMENT');

    $scope.howToShopEntry = {};
    $scope.curCollectionId = "";

    $scope.removeCollection = function(index) {
      $scope.howToShopEntry.collectionIds.splice(index, 1);
    };

    $scope.addCollection = function() {
      if(!$scope.howToShopEntry.collectionIds) {
        $scope.howToShopEntry.collectionIds = [];
      }
      if($scope.curCollectionId && $scope.curCollectionId !== "") {
        $scope.howToShopEntry.collectionIds.push($scope.curCollectionId);
        $scope.curCollectionId = "";
      }
    };

    $scope.addPicture = function() {
      if(!$scope.howToShopEntry.pictures) {
        $scope.howToShopEntry.pictures = [];
      }
      $scope.howToShopEntry.pictures.push({
        url: "",
        caption: ""
      });
    };

    $scope.removePicture = function(index) {
      $scope.howToShopEntry.pictures.splice(index, 1);
    };

    $scope.reset = function() {
      $window.location.reload(true);
    };

    $scope.save = function() {
      howToShopService.addNewHowToShopEntry({
        howToShopEntry: {
          title: $scope.howToShopEntry.title,
          text: $scope.howToShopEntry.text,
          pictures: $scope.howToShopEntry.pictures,
          collectionIds: $scope.howToShopEntry.collectionIds
        }
      }, $scope.useProdServer, $scope.useDevServer).then(function(entry) {
        //below could be more thorough
        entry = entry[0];
        var alertMsg = "Success! Entry " + entry.data.title + " was saved!";
        alert(alertMsg);
        $scope.reset();
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
        $scope.reset();
      });
    };

    $scope.howToShopEntrySanityCheck = function() {
      if(!$scope.useProdServer && !$scope.useDevServer) {
        return false;
      }
      //for each of pictures, make sure at least url
      if($scope.howToShopEntry.collectionIds && $scope.howToShopEntry.collectionIds.length > 0) {
        if($scope.howToShopEntry.pictures) {
          for (var i = $scope.howToShopEntry.pictures.length - 1; i >= 0; i--) {
            if(!$scope.howToShopEntry.pictures[i].url || $scope.howToShopEntry.pictures[i].url === "") {
              return false;
            }
          }
        }
        return true;
      } else {
        return false;
      }
    };
  }]);
