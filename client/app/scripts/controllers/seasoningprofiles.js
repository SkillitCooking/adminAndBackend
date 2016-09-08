'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:SeasoningprofilesCtrl
 * @description
 * # SeasoningprofilesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('SeasoningprofilesCtrl', ['$window', '$scope', 'seasoningService',
   function ($window, $scope, seasoningService) {

    seasoningService.getAllSeasonings().then(function(seasonings){
      $scope.profiles = seasonings.data;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });
    
    //reset the form
    $scope.reset = function() {
      $window.location.reload(true);
    };
    
    //save the input
    $scope.save = function() {
      //break up on basis of commas, eliminate trailing whitespace from each resultant term
      var spicesArr = $scope.seasoningProfile.spices.split(",");
      for (var i = spicesArr.length - 1; i >= 0; i--) {
        spicesArr[i] = spicesArr[i].trim();
      }
      seasoningService.addNewSeasoning({ seasoningProfile: {
        name: $scope.seasoningProfile.name,
        spices: spicesArr
      } }).then(function(seasoning) {
        $scope.profiles.push(seasoning);
        alert("Successfully saved seasoning");
        $scope.reset();
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
        $scope.reset();
      });
    };
  }]);
