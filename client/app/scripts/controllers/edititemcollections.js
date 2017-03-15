'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EdititemcollectionsCtrl
 * @description
 * # EdititemcollectionsCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditItemCollectionsCtrl', ['$window', '$scope', 'itemCollectionService', 'dietaryPreferenceService', 'recipeService', function ($window, $scope, itemCollectionService, dietaryPreferenceService, recipeService) {

    $scope.integerval = /^\d*$/;
    $scope.itemTypes = $scope.itemTypes = ["dailyTip", "trainingVideo", "howToShop", "glossary", "recipe"];

    $scope.serverType = 'DEVELOPMENT';

    $scope.doBulkAdd = false;

    $scope.reloadStuff = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      itemCollectionService.getAllItemCollections(isProd).then(function(res) {
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
      dietaryPreferenceService.getAllDietaryPreferences(isProd).then(function(res) {
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

    $scope.reloadStuff('DEVELOPMENT');

    $scope.setBulkAdd = function() {
      $scope.doBulkAdd = true;
    };

    $scope.changeSelectedCollection = function() {
      if($scope.selectedCollection) {
        for (var i = $scope.selectedCollection.dietaryPreferenceIds.length - 1; i >= 0; i--) {
          for (var j = $scope.dietaryPreferences.length - 1; j >= 0; j--) {
            if($scope.selectedCollection.dietaryPreferenceIds[i] == $scope.dietaryPreferences[j]._id) {
              $scope.dietaryPreferences[j].addToCollection = true;
            }
          }
        }
        $scope.itemCollection = angular.copy($scope.selectedCollection);
      }
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedCollection();
    };

    $scope.addPictureURL = function() {
      $scope.itemCollection.pictureURLs.push($scope.pictureURL);
      $scope.pictureURL = "";
    };

    $scope.removePictureURL = function(index) {
      $scope.itemCollection.pictureURLs.splice(index, 1);
    };

    $scope.noServerSelected = function() {
      return !$scope.useProdServer && !$scope.useDevServer;
    };

    $scope.saveChanges = function() {
      if(!$scope.itemCollection.orderPreference) {
        $scope.itemCollection.orderPreference = -1;
      }
      var dietaryPreferenceIds = [];
      for (var i = $scope.dietaryPreferences.length - 1; i >= 0; i--) {
        if($scope.dietaryPreferences[i].addToCollection) {
          dietaryPreferenceIds.push($scope.dietaryPreferences[i]._id);
        }
      }
      itemCollectionService.updateItemCollection({
        name: $scope.itemCollection.name,
        description: $scope.itemCollection.description,
        itemType: $scope.itemCollection.itemType,
        pictureURLs: $scope.itemCollection.pictureURLs,
        orderPreference: $scope.itemCollection.orderPreference,
        isBYOCollection: $scope.itemCollection.isBYOCollection,
        dietaryPreferenceIds: dietaryPreferenceIds,
        _id: $scope.itemCollection._id
      }, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        alert("ItemCollection successfully updated! Refresh page.");
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.saveBulkAdd = function() {
      if(!$scope.itemCollection.orderPreference) {
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
      itemCollectionService.updateItemCollectionBulk({
        name: $scope.itemCollection.name,
        description: $scope.itemCollection.description,
        itemType: $scope.itemCollection.itemType,
        pictureURLs: $scope.itemCollection.pictureURLs,
        orderPreference: $scope.itemCollection.orderPreference,
        isBYOCollection: $scope.itemCollection.isBYOCollection,
        dietaryPreferenceIds: dietaryPreferenceIds,
        _id: $scope.itemCollection._id
      }, recipeIds, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        alert("ItemCollection successfully updated! Refresh page.");
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.deleteCollection = function() {
      itemCollectionService.deleteItemCollection({_id: $scope.itemCollection._id}, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        //could be more thorough below...
        res = res[0];
        var affectedStr = "";
        switch(res.type) {
          case "tips":
            affectedStr += " Affected TipIds: \n" + res.affectedIds.toString();
            break;
          case "videos":
            affectedStr += " Affected VideoIds: \n" + res.affectedIds.toString();
            break;
          case "howToShop":
            affectedStr += " Affected HowToShopIds: \n" + res.affectedIds.toString();
            break;
          case "glossary":
            affectedStr += " Affected GlossaryIds: \n" + res.affectedIds.toString();
            break;
          case "recipe":
            affectedStr += " Affected RecipeIds: \n" + res.affectedIds.toString();
            break;
          default:
            break;
        }
        alert("ItemCollection successfully deleted! Refresh page." + affectedStr);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };
  }]);
