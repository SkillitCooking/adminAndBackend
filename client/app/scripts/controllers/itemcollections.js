'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:ItemcollectionsCtrl
 * @description
 * # ItemcollectionsCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('ItemcollectionsCtrl', ['$window', '$scope', 'itemCollectionService', 'dietaryPreferenceService', 'recipeService', function ($window, $scope, itemCollectionService, dietaryPreferenceService, recipeService) {

    $scope.integerval = /^\d*$/;
    $scope.itemCollection = {
      pictureURLs: []
    };
    $scope.itemTypes = ["dailyTip", "trainingVideo", "howToShop", "glossary", "recipe"];

    $scope.serverType = 'DEVELOPMENT';
    $scope.doBulkAdd = false;

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
      recipeService.getAllRecipesNameId(isProd).then(function(res) {
        $scope.recipes = res.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadPreferences('DEVELOPMENT');

    $scope.reset = function() {
      $window.location.reload(true);
    };

    $scope.setBulkAdd = function() {
      $scope.doBulkAdd = true;
    };

    $scope.noServerSelected = function() {
      return !$scope.useProdServer && !$scope.useDevServer;
    };

    $scope.addPictureURL = function() {
      $scope.itemCollection.pictureURLs.push($scope.pictureURL);
      $scope.pictureURL = "";
    };

    $scope.removePictureURL = function(index) {
      $scope.itemCollection.pictureURLs.splice(index, 1);
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
          pictureURLs: $scope.itemCollection.pictureURLs,
          pictureURL: $scope.itemCollection.pictureURLs[0],
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

    $scope.saveBulkAdd = function() {
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
      var recipeIds = $scope.recipes.filter(function(recipe) {
        return recipe.addToCollection;
      }).map(function(recipe) {
        return recipe._id;
      });
      itemCollectionService.addNewItemCollectionBulk({
        itemCollection: {
          name: $scope.itemCollection.name,
          description: $scope.itemCollection.description,
          itemType: $scope.itemCollection.itemType,
          pictureURLs: $scope.itemCollection.pictureURLs,
          pictureURL: $scope.itemCollection.pictureURLs[0],
          orderPreference: $scope.itemCollection.orderPreference,
          isBYOCollection: $scope.itemCollection.isBYOCollection,
          dietaryPreferenceIds: dietaryPreferenceIds 
        }
      }, recipeIds, $scope.useProdServer, $scope.useDevServer).then(function(collection) {
        collection = collection[0];
        var alertMsg = "Success! Item Collection " + collection.data.name + " was saved!";
        alert(alertMsg);
        $scope.reset();
      }, function(response) {
        console.log('Server Error: ', response);
        alert("Server Error: ", response);
        //$scope.reset();
      });
    };
  }]);
