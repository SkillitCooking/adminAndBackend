'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:DietarypreferencesCtrl
 * @description
 * # DietarypreferencesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('DietaryPreferencesCtrl', ['$window', '$scope', 'dietaryPreferenceService', 'ingredientService', function ($window, $scope, dietaryPreferenceService, ingredientService) {
    
    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadEntries = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      dietaryPreferenceService.getAllDietaryPreferences(isProd).then(function(prefs) {
        $scope.dietaryPreferences = prefs.data;
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
      });
      ingredientService.getAllIngredients(isProd).then(function(ingredients) {
        $scope.ingredients = ingredients;
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadEntries('DEVELOPMENT');

    $scope.reset = function() {
      $window.location.reload(true);
    };

    $scope.save = function() {
      //collect outlawIngredients
      var outlawIngredients = [];
      for (var i = $scope.ingredients.length - 1; i >= 0; i--) {
        if($scope.ingredients[i].useInPreference) {
          outlawIngredients.push($scope.ingredients[i].name.standardForm);
        }
      }
      dietaryPreferenceService.addNewDietaryPreference({
        dietaryPreference: {
          title: $scope.dietaryPreference.title,
          outlawIngredients: outlawIngredients
        }
      }, $scope.useProdServer, $scope.useDevServer).then(function(pref) {
        //below could be more thorough
        pref = pref[0];
        var alertMsg = "Success! Dietary Preference " + pref.data.title + " was saved!";
        alert(alertMsg);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $scope.reset();
      });
    };

    $scope.noServerSelected = function() {
      return !$scope.useDevServer && !$scope.useProdServer;
    };

  }]);
