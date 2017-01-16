'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:HealthmodifiersCtrl
 * @description
 * # HealthmodifiersCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('HealthModifiersCtrl', ['$window', '$scope', 'healthModifierService', function ($window, $scope, healthModifierService) {
    
    $scope.reset = function() {
      $window.location.reload(true);
    };

    $scope.save = function() {
      healthModifierService.addNewHealthModifier({healthModifier: {
        name: $scope.healthModifier.name
      }}, $scope.useProdServer, $scope.useDevServer).then(function(modifier) {
        console.log('modifer', modifier);
        alert("Successfully saved modifier");
        //$scope.reset();
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
        $scope.reset();
      });
    };
  }]);