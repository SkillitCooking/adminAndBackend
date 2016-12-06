'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:ItemcollectionsCtrl
 * @description
 * # ItemcollectionsCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('ItemcollectionsCtrl', ['$window', '$scope', 'itemCollectionService', 'dietaryPreferenceService', function ($window, $scope, itemCollectionService, dietaryPreferenceService) {
    
    $scope.integerval = /^\d*$/;
    $scope.itemCollection = {};
    $scope.itemTypes = ["dailyTip", "trainingVideo", "howToShop", "glossary", "recipe"];

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadPreferences = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      dietaryPreferenceService.getAllDietaryPreferences(isProd).then(function(res){
        $scope.dietaryPreferences = res.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadPreferences('DEVELOPMENT');

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
      var dietaryPreferenceIds = [];
      for (var i = $scope.dietaryPreferences.length - 1; i >= 0; i--) {
        if($scope.dietaryPreferences[i].addToCollection) {
          dietaryPreferenceIds.push($scope.dietaryPreferences[i]._id);
        }
      }
      itemCollectionService.addNewItemCollection({
        itemCollection: {
          name: $scope.itemCollection.name,
          description: $scope.itemCollection.description,
          itemType: $scope.itemCollection.itemType,
          pictureURL: $scope.itemCollection.pictureURL,
          orderPreference: $scope.itemCollection.orderPreference,
          isBYOCollection: $scope.itemCollection.isBYOCollection,
          dietaryPreferenceIds: dietaryPreferenceIds
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
