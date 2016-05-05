'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:SeasoningprofilesCtrl
 * @description
 * # SeasoningprofilesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('SeasoningprofilesCtrl', ['$scope', 'seasoningService',
   function ($scope, seasoningService) {

    seasoningService.getAllSeasonings().then(function(seasonings){
      $scope.profiles = seasonings;
    }, function(response) {
      console.log("Server Error: ", response.message);
      alert("Server Error: " + response.message);
    });
    
    //reset the form
    $scope.reset = function() {
      $scope.seasoningProfile = angular.copy({});
      $scope.seasoningForm.nameInput.$setUntouched();
      $scope.seasoningForm.spiceInput.$setUntouched();
    };
    
    //save the input
    $scope.save = function() {
      //break up on basis of commas, eliminate trailing whitespace from each resultant term
      let spicesArr = $scope.seasoningProfile.spices.split(",");
      for (var i = spicesArr.length - 1; i >= 0; i--) {
        spicesArr[i] = spicesArr[i].trim();
      }
      seasoningService.addNewSeasoning({ seasoningProfile: {
        name: $scope.seasoningProfile.name,
        spices: spicesArr
      } }).then(function(seasoning) {
        $scope.profiles.push(seasoning);
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
      });
      $scope.seasoningProfile = angular.copy({});
      $scope.seasoningForm.nameInput.$setUntouched();
      $scope.seasoningForm.spiceInput.$setUntouched();
    };
  }]);
