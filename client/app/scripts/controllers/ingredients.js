'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:IngredientCtrl
 * @description
 * # IngredientCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('IngredientCtrl', ['$window', '$scope', 'ingredientService', function ($window, $scope, ingredientService) {
    $scope.integerval = /^\d*$/;

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadIngredients = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      ingredientService.getAllIngredients(isProd).then(function(ingredients){
        $scope.ingredients = ingredients;
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
      });
    };

    $scope.reloadIngredients('DEVELOPMENT');

    $scope.ingredient = {name: {}};

    $scope.inForms = [];
    $scope.inputCategories = ["Protein", "Vegetables", "Starches", "Other"];
    $scope.inputSubCategories = [];
    $scope.cookingMethods = ["Bake", "Sautee", "Boil", "Steam", "SlowCook"];

    $scope.addCookingTime = function(ingredientForm) {
      ingredientForm.cookingTimes.push({
        cookingMethod: "",
        minTime: "",
        maxTime: "",
        timesArePerSide: false
      });
    };

    $scope.changeInputCategory = function() {
      if($scope.ingredient) {
        switch($scope.ingredient.inputCategory) {
          case 'Protein':
            $scope.inputSubCategories = ['Meat', 'Seafood', 'Other'];
            break;
          default:
            $scope.inputSubCategories = ['None'];
            break;
        }
      }
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

    $scope.ingredientTips = [];

    $scope.stepTypes = ["Bake", "Boil", "BringToBoil", "BreakEgg", "Cook", "Custom", "Cut", "Dry", "Heat", "Move", "Place", "PreheatOven", "Remove", "Sautee", "Serve", "Season", "SlowCook", "Steam", "EquipmentPrep", "Stir", "General"];
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
        stepType: "",
        videoInfo: {}
      });
    };

    $scope.ingredientSanityCheck = function() {
      if(!$scope.useProdServer && !$scope.useDevServer) {
        return false;
      }
      if($scope.ingredient.ingredientForms){
        return true;
      }
      return false;
    };

    $scope.reset = function() {
      $window.location.reload(true);
    };

    $scope.preview = function() {
      $scope.ingredient.ingredientForms = $scope.inForms;
      $scope.ingredient.ingredientTips = $scope.ingredientTips;
    };

    $scope.save = function() {
      $scope.ingredient.ingredientForms = $scope.inForms;
      $scope.ingredient.ingredientTips = $scope.ingredientTips;
      if(!$scope.ingredient.showInSelection) {
        $scope.ingredient.showInSelection = false;
      }
      ingredientService.addNewIngredient({
        ingredient: {
          name: $scope.ingredient.name,
          ingredientForms: $scope.ingredient.ingredientForms,
          ingredientTips: $scope.ingredient.ingredientTips,
          inputCategory: $scope.ingredient.inputCategory,
          inputSubCategory: $scope.ingredient.inputSubCategory,
          units: $scope.ingredient.units,
          showInSelection: $scope.ingredient.showInSelection,
          unitIsASingleItem: $scope.ingredient.unitIsASingleItem,
          servingsPerUnit: $scope.ingredient.servingsPerUnit,
          useFormNameForDisplay: $scope.ingredient.useFormNameForDisplay,
          nameFormFlag: 'standardForm'
        }
      }, $scope.useProdServer, $scope.useDevServer).then(function(ingredient) {
        //below could be more sophisticated
        ingredient = ingredient[0];
        $scope.ingredients.push(ingredient);
        alert("Successfully saved ingredient");
        $scope.reset();
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $scope.reset();
      });
    };
  }]);
