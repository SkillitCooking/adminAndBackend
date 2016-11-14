'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditdietarypreferencesCtrl
 * @description
 * # EditdietarypreferencesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditDietaryPreferencesCtrl', ['$window' ,'$scope', 'dietaryPreferenceService', 'ingredientService', function ($window, $scope, dietaryPreferenceService, ingredientService) {

    $scope.serverType = 'DEVELOPMENT';

    function loadIngredients() {
      //a little inefficient below, buttfuck it. Not going to matter with the n's
      //we'll be dealing with
      for (var i = $scope.ingredients.length - 1; i >= 0; i--) {
        $scope.ingredients[i].useInPreference = false;
      }
      for (var k = $scope.dietaryPreference.outlawIngredients.length - 1; k >= 0; k--) {
        for (var i = $scope.ingredients.length - 1; i >= 0; i--) {
          if($scope.dietaryPreference.outlawIngredients[k] === $scope.ingredients[i].name.standardForm) {
            $scope.ingredients[i].useInPreference = true;
          }
        }
      }
    }

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

    $scope.changeSelectedDietaryPreference = function() {
      if($scope.selectedDietaryPreference) {
        $scope.dietaryPreference = angular.copy($scope.selectedDietaryPreference);
        loadIngredients();
      }
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedDietaryPreference();
    };

    $scope.saveChanges = function() {
      //get outlaw
      var outlawIngredients = [];
      for (var i = $scope.ingredients.length - 1; i >= 0; i--) {
        if($scope.ingredients[i].useInPreference) {
          outlawIngredients.push($scope.ingredients[i].name.standardForm);
        }
      }
      dietaryPreferenceService.updateDietaryPreference({
        dietaryPreference: {
          title: $scope.dietaryPreference.title,
          outlawIngredients: outlawIngredients,
          _id: $scope.dietaryPreference._id
        }
      }, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        alert("Dietary Preference successfully updated! Refresh page.");
        $window.location.reload(true);
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
        //$window.location.reload(true);
      });
    };

    $scope.noServerSelected = function() {
      return !$scope.useDevServer && !$scope.useProdServer;
    };

    $scope.deleteDietaryPreference = function() {
      dietaryPreferenceService.deleteDietaryPreference({_id: $scope.dietaryPreference._id}, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        alert("Dietary Preference successfully deleted! Refresh page.");
        $window.location.reload(true);
      }, function(response) {
        alert("Server Error - check console logs for details");
        console.log("error response: ", response);
        $window.location.reload(true);
      });
    };
    
  }]);
