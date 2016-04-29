'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:IngredientCtrl
 * @description
 * # IngredientCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('IngredientCtrl', ['$scope', 'ingredientService', function ($scope, ingredientService) {
    $scope.integerval = /^\d*$/;

    ingredientService.getAllIngredients().then(function(ingredients){
      $scope.ingredients = ingredients;
    }, function(response) {
      console.log("Server Error: ", response.message);
    });

    $scope.inForms = [
    ];
    $scope.cookingMethods = ["testMethod", "testTest", "hola"];

    $scope.addCookingTime = function(ingredientForm) {
      ingredientForm.cookingTimes.push({
        cookingMethod: "",
        minTime: "",
        maxTime: "",
        timesArePerSide: false
      });
    };

    $scope.addIngredientForm = function() {
      $scope.inForms.push({
        name: "",
        cookingTimes: [{
          cookingMethod: "",
          minTime: "",
          maxTime: "",
          timesArePerSide: false
        }]
      });
    };

    $scope.removeCookingTime = function(ingredientForm, timeIndex) {
      ingredientForm.cookingTimes.splice(timeIndex, 1);
    };

    $scope.removeIngredientForm = function(index) {
      $scope.inForms.splice(index, 1);
    }

    $scope.ingredientTips = [
    ];

    $scope.stepTypes = ["type1", "type2", "type3"];
    $scope.subTypes = [];

    $scope.setSubTypes = function(type, tipIndex) {
      switch(type) {
        case "type1":
          $scope.subTypes[tipIndex] = ["subType1A", "subType1B"];
          break;
        case "type2":
          $scope.subTypes[tipIndex] = ["subType2A", "subType2B"];
          break;
        case "type3":
          $scope.subTypes[tipIndex] = ["subType3A", "subType3B"];
          break;
        default:
          break;
      }
    };

    $scope.removeTip = function(tipIndex) {
      $scope.ingredientTips.splice(tipIndex, 1);
    };

    $scope.addIngredientTip = function() {
      $scope.ingredientTips.push({
        stepType: ""
      });
    };

    $scope.ingredientSanityCheck = function() {
      if($scope.ingredient.ingredientForms){
        return true;
      }
      return false;
    };

    $scope.reset = function() {
      $scope.inForms = angular.copy([]);
      $scope.ingredientTips = angular.copy([]);
      $scope.ingredient = angular.copy({});
      $scope.ingredientForm.nameInput.$setUntouched();
    };

    $scope.preview = function() {
      $scope.ingredient.ingredientForms = $scope.inForms;
      $scope.ingredient.ingredientTips = $scope.ingredientTips;
    };

    $scope.save = function() {
      $scope.ingredient.ingredientForms = $scope.inForms;
      $scope.ingredient.ingredientTips = $scope.ingredientTips;
      ingredientService.addNewIngredient({
        ingredient: {
          name: $scope.ingredient.name,
          ingredientForms: $scope.ingredient.ingredientForms,
          ingredientTips: $scope.ingredient.ingredientTips
        }
      }).then(function(ingredient) {
        $scope.ingredients.push(ingredient);
      }, function(response) {
        console.log("Server Error: ", response.message);
      });
      $scope.reset();
    };
  }]);
