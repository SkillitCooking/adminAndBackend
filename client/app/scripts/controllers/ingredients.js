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

    $scope.ingredient = {name: {}};

    ingredientService.getAllIngredients().then(function(ingredients){
      $scope.ingredients = ingredients;
    }, function(response) {
      console.log("Server Error: ", response.message);
      alert("Server Error: " + response.message);
    });

    $scope.inForms = [
    ];
    $scope.inputCategories = ["Protein", "Vegetables", "Starches", "Other"];
    $scope.cookingMethods = ["Bake", "Sautee", "Boil", "Steam", "SlowCook"];

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
    };

    $scope.ingredientTips = [
    ];

    $scope.stepTypes = ["Bake", "Boil", "BringToBoil", "Custom", "Cut", "Dry", "Heat", "Place", "PreheatOven", "Sautee", "Season", "SlowCook", "Steam", "EquipmentPrep", "Stir"];
    $scope.subTypes = [];

    $scope.setSubTypes = function(type, tipIndex) {
      switch(type) {
        case "Cut":
          $scope.subTypes[tipIndex] = ["Cut", "Chop", "Dice", "Slice", "Mince", "all"];
          break;
        case "Dry":
          $scope.subTypes[tipIndex] = ["Pat", "Rub", "all"];
          break;
        case "EquipmentPrep":
          $scope.subTypes[tipIndex] = ["Grease", "Line", "all"];
          break;
        case "Stir":
          $scope.subTypes[tipIndex] = ["Stir", "Flip", "all"];
          break;
        default:
          $scope.subTypes[tipIndex] = ["all"];
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
      $scope.ingredient = angular.copy({name: {}});
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
          ingredientTips: $scope.ingredient.ingredientTips,
          inputCategory: $scope.ingredient.inputCategory,
          units: $scope.ingredient.units,
          unitIsASingleItem: $scope.ingredient.unitIsASingleItem,
          servingsPerUnit: $scope.ingredient.servingsPerUnit,
          nameFormFlag: 'standardForm'
        }
      }).then(function(ingredient) {
        $scope.ingredients.push(ingredient);
      }, function(response) {
        console.log("Server Error: ", response.message);
        console.log(response);
        alert("Server Error: " + response.message);
      });
      $scope.reset();
    };
  }]);
