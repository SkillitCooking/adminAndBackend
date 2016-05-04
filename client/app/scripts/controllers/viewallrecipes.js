'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:ViewallrecipesCtrl
 * @description
 * # ViewallrecipesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('ViewallrecipesCtrl', ['$scope', function ($scope) {
    /*$scope.step = {
      stepDuration: "1",
      bakingTime: "2",
      productInput: {
        sourceId: "id",
        sourceType: "type",
        key: "flippant"
      },
      auxiliarySteps: [
        {
          ingredientTypeName: "name",
          whenToStir: "occ",
          stirType: "hello"
        },
        {
          ingredientTypeName: "name1",
          whenToStir: "occ1",
          stirType: "hello1"
        }
      ],
      stepTip: {
        title: "balls",
        text: "even more testicles",
        pictureURL: "http://asjdlkfsdk",
        videoTitle: "videoTitle",
        videoURL: "http://adjflds"
      }
    };*/
    $scope.auxStepIngredientType = "fecal matter";
    $scope.constructingStep = {stepType: "BringToBoil"};
    $scope.step = $scope.constructingStep;
    $scope.ingredientList = {
      ingredientTypes: [
        {typeName: "typetype"},
        {typeName: "hothot"},
        {typeName: "buttbutt"}
      ],
      equipmentNeeded: [
        {name: "dish1"},
        {name: "dish2"},
        {name: "dish3"}
      ]
    };
    $scope.stepList = [
      {
        stepType: "type1",
        stepId: "id1",
        productKeys: ["x","y","z"]
      },
      {
        stepType: "type3",
        stepId: "id2",
        productKeys: ["x","y"]
      },
      {
        stepType: "type2",
        stepId: "id3",
        productKeys: ["x","z"]
      }
    ];
  }]);
