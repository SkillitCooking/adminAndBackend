'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditingredientsCtrl
 * @description
 * # EditingredientsCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditIngredientsCtrl', ['$window', '$scope', 'ingredientService', function ($window, $scope, ingredientService) {
    $scope.integerval = /^\d*$/;
    $scope.inputCategories = ["Protein", "Vegetables", "Starches", "Other"];
    $scope.cookingMethods = ["Bake", "Sautee", "Boil", "Steam", "SlowCook"];
    $scope.stepTypes = ["Bake", "Boil", "BringToBoil", "Cook", "Custom", "Cut", "Dry", "Heat", "Place", "PreheatOven", "Sautee", "Season", "SlowCook", "Steam", "EquipmentPrep", "Stir"];
    $scope.subTypes = [];

    ingredientService.getAllIngredients().then(function(ingredients) {
      $scope.ingredients = ingredients;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

    $scope.changeSelectedIngredient = function() {
      if($scope.selectedIngredient) {
        $scope.ingredient = angular.copy($scope.selectedIngredient);
        $scope.ingredientTipsIndicatorArray = new Array($scope.ingredient.ingredientTips.length);
        $scope.ingredientTipsIndicatorArray.fill(true);
        for (var i = 0; i < $scope.ingredients.length; i++) {
          for (var j = 0; j < $scope.ingredients[i].ingredientTips.length; j++) {
            $scope.setSubTypes($scope.ingredients[i].ingredientTips[j].stepType, j);
          }
        }
        $scope.ingredientFormsIndicatorArray = new Array($scope.ingredient.ingredientForms.length);
        $scope.ingredientFormsIndicatorArray.fill(true);
      }
    };

    $scope.isIngredientFormMinimized = function(index) {
      return $scope.ingredientFormsIndicatorArray[index];
    };

    $scope.removeCookingTime = function(form, index) {
      form.cookingTimes.splice(index, 1);
    };

    $scope.addCookingTime = function(form) {
      form.cookingTimes.push({
        cookingMethod: "",
        minTime: "",
        maxTime: "",
        timesArePerSide: false
      });
    };

    $scope.removeIngredientForm = function(index) {
      $scope.ingredient.ingredientForms.splice(index, 1);
      $scope.ingredientFormsIndicatorArray.splice(index, 1);
    };

    $scope.toggleIngredientForm  = function(index) {
      $scope.ingredientFormsIndicatorArray[index] = !$scope.ingredientFormsIndicatorArray[index];
    };

    $scope.getIngredientFormVisibilityText = function(index) {
      if($scope.ingredientFormsIndicatorArray[index]) {
        return 'Expand';
      } else {
        return 'Minimize';
      }
    };

    $scope.addIngredientForm = function() {
      $scope.ingredient.ingredientForms.push({
        name: "",
        cookingTimes: [{
          cookingMethod: "",
          minTime: "",
          maxTime: "",
          timesArePerSide: false
        }]
      });
    };

    $scope.isIngredientTipMinimized = function(index) {
      return $scope.ingredientTipsIndicatorArray[index];
    };

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

    $scope.toggleTip = function(index) {
      $scope.ingredientTipsIndicatorArray[index] = !$scope.ingredientTipsIndicatorArray[index];
    };

    $scope.getTipVisibilityText = function(index) {
      if($scope.ingredientTipsIndicatorArray[index]) {
        return 'Expand';
      } else {
        return 'Minimize';
      }
    };

    $scope.removeTip = function(index) {
      $scope.ingredient.ingredientTips.splice(index, 1);
      $scope.ingredientTipsIndicatorArray.splice(index, 1);
    };

    $scope.addIngredientTip = function() {
      $scope.ingredient.ingredientTips.push({
        stepType: ""
      });
    };

    $scope.cancelChanges = function() {
      $scope.changeSelectedIngredient();
    };

    $scope.saveChanges = function() {
      ingredientService.updateIngredient({
        name: $scope.ingredient.name,
        ingredientForms: $scope.ingredient.ingredientForms,
        ingredientTips: $scope.ingredient.ingredientTips,
        inputCategory: $scope.ingredient.inputCategory,
        units: $scope.ingredient.units,
        unitIsASingleItem: $scope.ingredient.unitIsASingleItem,
        servingsPerUnit: $scope.ingredient.servingsPerUnit,
        nameFormFlag: 'standardForm',
        _id: $scope.ingredient._id
      }).then(function(res) {
        var recipeStr = "";
        if(res.affectedRecipeIds && res.affectedRecipeIds.length > 0) {
          recipeStr += " Affected Recipe Ids: \n" + res.affectedRecipeIds.toString();
        }
        alert("Ingredient successfully updated! Refresh page." + recipeStr);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.deleteIngredient = function() {
      ingredientService.deleteIngredient({_id: $scope.ingredient._id}).then(function(res) {
        var recipeStr = "";
        if(res.affectedRecipeIds && res.affectedRecipeIds.length > 0) {
          recipeStr += " Affected Recipe Ids: \n" + res.affectedRecipeIds.toString();
        }
        alert("Ingredient successfully deleted. Refresh page." + recipeStr);
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };
  }]);
