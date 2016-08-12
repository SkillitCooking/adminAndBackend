'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:RecipeCtrl
 * @description
 * # RecipeCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('RecipeCtrl', ['$scope', 'recipeService', 'seasoningService', 'ingredientService', 'dishService', 'itemCollectionService', '_', function ($scope, recipeService, seasoningService, ingredientService, dishService, itemCollectionService, _) {
    $scope.integerval = /^\d*$/;

    $scope.recipe = {
      canAddSeasoningProfile: true
    };

    itemCollectionService.getItemCollectionsForType('recipe').then(function(collections) {
      $scope.recipeCollections = collections.data;
    }, function(response) {
      console.log("Server Error: ", response.message);
      alert("Server Error: " + response.message);
    });

    seasoningService.getAllSeasonings().then(function(seasonings) {
      $scope.seasoningProfiles = seasonings.data;
    }, function(response) {
      console.log("Server Error: ", response.message);
      alert("Server Error: " + response.message);
    });

    $scope.logShitttt = function() {
      console.log("recipe: ", $scope.recipe);
    };

    ingredientService.getAllIngredients().then(function(ingredients) {
      $scope.ingredients = ingredients;
    }, function(response) {
      console.log("Server Error: ", response.message);
      alert("Server Error: " + response.message);
    });

    dishService.getAllDishes().then(function(dishes) {
      $scope.dishes = dishes;
    }, function(response) {
      console.log("Server Error: ", response.message);
      alert("Server Error: " + response.message);
    });

    $scope.stepTypes = ["Bake", "Boil", "BringToBoil", "Cook", "Custom", "Cut", "Dry", "Heat", "Place", "PreheatOven", "Sautee", "Season", "SlowCook", "Steam", "EquipmentPrep", "Stir"];
    $scope.recipeTypes = ["AlaCarte", "BYO", "Full"];
    $scope.recipeCategories = ["Sautee", "Scramble", "Roast", "Pasta", "Hash", "Rice", "Quinoa"];
    $scope.cookingMethods = ["Bake", "Sautee", "Boil", "Steam", "SlowCook"];
    $scope.selectedIngredientForms = [];

    //initialize constructingStep and it's stepInputs object
    $scope.constructingStep = {};
    $scope.constructingStep.stepInputs = {};

    $scope.ingredientList = {
      ingredientTypes: [],
      equipmentNeeded: []
    };

    $scope.stepList = [];

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

    $scope.addCookingMethod = function() {
      if(!$scope.recipe.otherCookingMethods){
        $scope.recipe.otherCookingMethods = [];
      }
      if($scope.recipe.otherCookingMethods.indexOf($scope.otherCookingMethod) === -1){
        $scope.recipe.otherCookingMethods.push($scope.otherCookingMethod);
      }
    };

    $scope.removeCookingMethod = function(methodIndex) {
      $scope.recipe.otherCookingMethods.splice(methodIndex, 1);
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

    $scope.ingredientCanBeAdded = function(ingredient){
      var ingredientTypes = $scope.ingredientList.ingredientTypes;
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
        if(!$scope.ingredientList.ingredientTypes[typeIndex].ingredients){
          $scope.ingredientList.ingredientTypes[typeIndex].ingredients = [];
        }
        $scope.ingredientList.ingredientTypes[typeIndex].ingredients.push(ingredient);
      }
    };

    $scope.removeTypeIngredient = function(type, ingredientIndex) {
      type.ingredients.splice(ingredientIndex, 1);
    };

    $scope.removeIngredientType = function(index){
      $scope.ingredientList.ingredientTypes.splice(index, 1);
    };

    $scope.addIngredientType = function() {
      if(!$scope.ingredientList.ingredientTypes){
        $scope.ingredientList.ingredientTypes = [];
      }
      $scope.ingredientList.ingredientTypes.push({
        typeName: "",
        displayName: "",
        ingredients: [],
        minNeeded: ""
      });
    };

    $scope.addSeasoning = function() {
      if(!$scope.recipe.choiceSeasoningProfiles) {
        $scope.recipe.choiceSeasoningProfiles = [];
      }
      if($scope.recipe.choiceSeasoningProfiles.indexOf($scope.availableSeasoning) === -1){
        $scope.recipe.choiceSeasoningProfiles.push($scope.availableSeasoning);
      }
    };

    $scope.removeSeasoning = function(index) {
      $scope.recipe.choiceSeasoningProfiles.splice(index, 1);
    };

    $scope.addDish = function() {
      if(!$scope.ingredientList.equipmentNeeded){
        $scope.ingredientList.equipmentNeeded = [];
      }
      if($scope.ingredientList.equipmentNeeded.indexOf($scope.typeDish) === -1){
        $scope.ingredientList.equipmentNeeded.push($scope.typeDish);
      }
    };

    $scope.removeDish = function(index) {
      $scope.ingredientList.equipmentNeeded.splice(index, 1);
    };

    $scope.addStep = function() {
      if(!$scope.squishedRecipeName){
        var nameTokens = $scope.recipe.name.split(" ");
        $scope.squishedRecipeName = nameTokens.join("");
      }
      $scope.constructingStep.stepId = $scope.squishedRecipeName + _.uniqueId($scope.constructingStep.stepType);
      $scope.constructingStep.productKeys = [$scope.constructingStep.productName];
      $scope.constructingStep.productName = undefined;
      $scope.stepList.push($scope.constructingStep);
      $scope.constructingStep = {};
      $scope.constructingStep.stepInputs = {};
    };

    $scope.removeStep = function() {
      $scope.stepList = $scope.recipe.stepList = _.dropRight($scope.stepList);
    };

    $scope.addCollection = function() {
      if(!$scope.recipe.collectionIds) {
        $scope.recipe.collectionIds = [];
      }
      if($scope.curCollectionId && $scope.curCollectionId !== "") {
        $scope.recipe.collectionIds.push($scope.curCollectionId);
        $scope.curCollectionId = "";
      }
    };

    $scope.removeCollection = function(index) {
      $scope.recipe.collectionIds.splice(index, 1);
    };

    $scope.recipeSanityCheck = function() {
      if (!$scope.recipe.stepList || $scope.recipe.stepList.length === 0) {
        return false;
      }
      if(!$scope.recipe.ingredientList){
        return false;
      }
      if(!$scope.recipe.ingredientList.ingredientTypes || $scope.recipe.ingredientList.ingredientTypes.length === 0){
        return false;
      } 
      if(!$scope.recipe.ingredientList.equipmentNeeded){
        return false;
      }
      if(!$scope.recipe.collectionIds || $scope.recipe.collectionIds.length === 0){
        return false;
      }
      return true;
    };

    $scope.reset = function() {
      $scope.constructingStep = angular.copy({});
      $scope.stepList = angular.copy([]);
      $scope.ingredientList = angular.copy({});
      $scope.recipe = angular.copy({});
      $scope.recipeForm.$setPristine();
      $scope.recipeForm.$setUntouched();
    };

    $scope.save = function() {
      $scope.recipe.ingredientList = $scope.ingredientList;
      $scope.recipe.stepList = $scope.stepList;
      if(!$scope.recipe.canAddSeasoningProfile){
        $scope.recipe.canAddSeasoningProfile = false;
      }
      $scope.getGlobalCookTimes();
      recipeService.addNewRecipe({ 
        recipe:{
          name: $scope.recipe.name,
          description: $scope.recipe.description,
          defaultServingSize: $scope.recipe.defaultServingSize,
          recipeType: $scope.recipe.recipeType,
          collectionIds: $scope.recipe.collectionIds,
          recipeCategory: $scope.recipe.recipeCategory,
          ingredientList: $scope.recipe.ingredientList,
          stepList: $scope.recipe.stepList,
          primaryCookingMethod: $scope.recipe.primaryCookingMethod,
          otherCookingMethods: $scope.recipe.otherCookingMethods,
          canAddSeasoningProfile: $scope.recipe.canAddSeasoningProfile,
          defaultSeasoningProfile: $scope.recipe.defaultSeasoningProfile,
          choiceSeasoningProfiles: $scope.recipe.choiceSeasoningProfiles,
          primaryIngredientType: $scope.recipe.primaryIngredientType,
          mainPictureURL: $scope.recipe.mainPictureURL,
          mainVideoURL: $scope.recipe.mainVideoURL,
          prepTime: $scope.recipe.prepTime,
          totalTime: $scope.recipe.totalTime,
          hasBeenRecipeOfTheDay: false,
          datesUsedAsRecipeOfTheDay: [],
          isRecipeOfTheDay: false
        }
      }).then(function(recipe){
        var alertMsg = "Success! Recipe " + recipe.name + " was saved!";
        alert(alertMsg);
      }, function(response) {
        console.log("Server Error: ", response.message);
        alert("Server Error: " + response.message);
      });
      $scope.reset();
    };

    $scope.isPrepStep = function(stepType) {
      return ["BringToBoil", "Custom", "Cut", "Dry", "Heat", "Place", "PreheatOven", "Season", "EquipmentPrep", "Stir"].includes(stepType);
    }

    $scope.getGlobalCookTimes = function() {
      $scope.recipe.prepTime = 0;
      $scope.recipe.totalTime = 0;
      for (var i = $scope.recipe.stepList.length - 1; i >= 0; i--) {
        $scope.recipe.totalTime += parseInt($scope.recipe.stepList[i].stepDuration, 10);
        if($scope.isPrepStep($scope.recipe.stepList[i].stepType)){
          $scope.recipe.prepTime += parseInt($scope.recipe.stepList[i].stepDuration, 10);
        }
      }
    };

    $scope.preview = function() {
      $scope.recipe.ingredientList = $scope.ingredientList;
      $scope.recipe.stepList = $scope.stepList;
    };
  }]);
