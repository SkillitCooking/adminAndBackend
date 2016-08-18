'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditrecipesCtrl
 * @description
 * # EditrecipesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditRecipesCtrl', ['$scope', 'recipeService', 'itemCollectionService', 'seasoningService', 'ingredientService', 'dishService', function ($scope, recipeService, itemCollectionService, seasoningService, ingredientService, dishService) {

    $scope.integerval = /^\d*$/;
    $scope.recipeTypes = ["AlaCarte", "BYO", "Full"];
    $scope.recipeCategories = ["Sautee", "Scramble", "Roast", "Pasta", "Hash", "Rice", "Quinoa"];
    $scope.servingSizes = ["1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10"];
    $scope.cookingMethods = ["Bake", "Sautee", "Boil", "Steam", "SlowCook"];
    $scope.selectedIngredientForms = [];
    
    recipeService.getAllRecipes().then(function(res) {
      $scope.recipes = res.data;
    }, function(response){
      console.log('server error', response);
      alert("Server Error: " + response.message);
    });

    itemCollectionService.getItemCollectionsForType('recipe').then(function(res) {
      $scope.recipeCollections = res.data;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

    seasoningService.getAllSeasonings().then(function(res) {
      $scope.seasoningProfiles = res.data;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

    ingredientService.getAllIngredients().then(function(ingredients) {
      $scope.ingredients = ingredients;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

    dishService.getAllDishes().then(function(dishes) {
      $scope.dishes = dishes;
    }, function(response) {
      console.log("Server Error: ", response);
      alert("Server Error: " + response.message);
    });

    $scope.changeSelectedRecipe = function() {
      $scope.recipe = angular.copy($scope.selectedRecipe);
      $scope.ingredientList = $scope.recipe.ingredientList;
      $scope.stepList = $scope.recipe.stepList;
      $scope.typeMinimizedIndicatorArray = new Array($scope.recipe.ingredientList.ingredientTypes.length);
      $scope.typeMinimizedIndicatorArray.fill(true);
      var types = $scope.recipe.ingredientList.ingredientTypes;
      for (var i = types.length - 1; i >= 0; i--) {
        types[i].ingredientMinimizedIndicator = new Array(types[i].ingredients.length);
        types[i].ingredientMinimizedIndicator.fill(true);
      }
    };

    $scope.removeCollection = function(index) {
      $scope.recipe.collectionIds.splice(index, 1);
    };

    $scope.addCollection = function() {
      $scope.recipe.collectionIds.push($scope.curCollectionId);
    };

    $scope.removeCookingMethod = function(index) {
      $scope.recipe.otherCookingMethods.splice(index, 1);
    };

    $scope.addCookingMethod = function() {
      $scope.recipe.otherCookingMethods.push($scope.otherCookingMethod);
    };

    $scope.addSeasoning = function() {
      $scope.recipe.choiceSeasoningProfiles.push($scope.availableSeasoning);
    };

    $scope.removeSeasoning = function(index) {
      $scope.recipe.choiceSeasoningProfiles.splice(index, 1);
    };

    $scope.isIngredientMinimized = function(index) {
      return $scope.typeMinimizedIndicatorArray[index];
    };

    $scope.setSelectedIngredientForms = function (typeIngredient) {
      var length;
      if(typeIngredient && typeIngredient.ingredientForms){
        length = typeIngredient.ingredientForms.length;
      } else {
        length = 0;
      }
      $scope.selectedIngredientForms = new Array(length);
      $scope.selectedIngredientForms.fill(true);
    };

    $scope.isAFormSelected = function() {
      if($scope.selectedIngredientForms.length === 0){
        return false;
      }
      for (var i = $scope.selectedIngredientForms.length - 1; i >= 0; i--) {
        if($scope.selectedIngredientForms[i]){
          return true;
        }
      }
      return false;
    };

    $scope.addTypeIngredient = function(typeIndex, typeIngredient) {
      if($scope.ingredientCanBeAdded(typeIngredient)){
        var chosenForms = [];
        for (var i = typeIngredient.ingredientForms.length - 1; i >= 0; i--) {
          if($scope.selectedIngredientForms[i]){
            chosenForms.push(typeIngredient.ingredientForms[i]);
          }
        }
        var ingredient = {
          name: typeIngredient.name,
          ingredientForms: chosenForms,
          ingredientTips: typeIngredient.ingredientTips,
          inputCategory: typeIngredient.inputCategory
        };
        if(!$scope.recipe.ingredientList.ingredientTypes[typeIndex].ingredients){
          $scope.recipe.ingredientList.ingredientTypes[typeIndex].ingredients = [];
        }
        $scope.recipe.ingredientList.ingredientTypes[typeIndex].ingredients.push(ingredient);
      }
    };

    $scope.ingredientCanBeAdded = function(ingredient){
      var ingredientTypes = $scope.recipe.ingredientList.ingredientTypes;
      var ingredients;
      for (var i = ingredientTypes.length - 1; i >= 0; i--) {
        ingredients = ingredientTypes[i].ingredients;
        for (var j = ingredients.length - 1; j >= 0; j--) {
          if(ingredients[j].name === ingredient.name){
            return false;
          }
        }
      }
      return true;
    };

    $scope.isIngredientMinimized = function(ingredientType, ingredientIndex) {
      return ingredientType.ingredientMinimizedIndicator[ingredientIndex];
    };

    $scope.toggleIngredientExpand = function(ingredientType, ingredientIndex) {
      ingredientType.ingredientMinimizedIndicator[ingredientIndex] = !ingredientType.ingredientMinimizedIndicator[ingredientIndex];
    };

    $scope.removeTypeIngredient = function(ingredientType, ingredientIndex) {
      ingredientType.ingredients.splice(ingredientIndex, 1);
      ingredientType.ingredientMinimizedIndicator.splice(ingredientIndex, 1);
    };

    $scope.isIngredientTypeMinimized = function(index) {
      return $scope.typeMinimizedIndicatorArray[index];
    };

    $scope.toggleIngredientTypeExpand = function(index) {
      $scope.typeMinimizedIndicatorArray[index] = !$scope.typeMinimizedIndicatorArray[index];
    };

    $scope.removeIngredientType = function(index) {
      $scope.typeMinimizedIndicatorArray.splice(index, 1);
      $scope.recipe.ingredientList.ingredientTypes.splice(index, 1);
    };

    $scope.addIngredientType = function() {
      //push new type on
      //push reverse value onto indicator
      if(!$scope.recipe.ingredientList.ingredientTypes){
        $scope.recipe.ingredientList.ingredientTypes = [];
      }
      $scope.recipe.ingredientList.ingredientTypes.push({
        typeName: "",
        displayName: "",
        ingredients: [],
        minNeeded: ""
      });
      $scope.typeMinimizedIndicatorArray.push(false);
    };

    $scope.addDish = function() {
      $scope.recipe.ingredientList.equipmentNeeded.push($scope.typeDish);
    };

    $scope.removeDish = function(index) {
      $scope.recipe.ingredientList.equipmentNeeded.splice(index, 1);
    };

  }]);
