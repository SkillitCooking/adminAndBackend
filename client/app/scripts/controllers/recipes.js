'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:RecipeCtrl
 * @description
 * # RecipeCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('RecipeCtrl', ['$window', '$scope', 'recipeService', 'seasoningService', 'ingredientService', 'dishService', 'itemCollectionService', '_', function ($window, $scope, recipeService, seasoningService, ingredientService, dishService, itemCollectionService, _) {
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
    $scope.recipeCategories = ["Sautee", "Easy Dinners", "Scramble", "Roast", "Pasta", "Hash", "Rice", "Quinoa"];
    $scope.cookingMethods = ["Bake", "Sautee", "Boil", "Steam", "SlowCook"];
    $scope.servingSizes = ["1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10"];
    $scope.selectedIngredientForms = [];

    //initialize constructingStep and it's stepInputs object
    $scope.constructingStep = {};
    $scope.constructingStep.stepInputs = {};

    $scope.ingredientList = {
      ingredientTypes: [],
      equipmentNeeded: []
    };

    $scope.stepList = [];

    $scope.logRecipeName = function() {
      $scope.originalName = $scope.recipe.name;
    };

    $scope.updateRecipeName = function() {
      var nameTokens = $scope.recipe.name.split(" ");
      $scope.squishedRecipeName = nameTokens.join("");
      if($scope.stepList) {
        for (var i = $scope.stepList.length - 1; i >= 0; i--) {
          $scope.stepList[i].stepId = $scope.squishedRecipeName + i;
          //look at inputs, if sourceId, then look up step in shortened array, project stepId
          //for use in sourceId
          for(var key in $scope.stepList[i].stepInputs) {
            if(Array.isArray($scope.stepList[i].stepInputs[key])) {
              for (var j = $scope.stepList[i].stepInputs[key].length - 1; j >= 0; j--) {
                if($scope.stepList[i].stepInputs[key][j].sourceId) {
                  for (var k = $scope.stepList.length - 1; k >= 0; k--) {
                    if($scope.stepList[k].stepId === $scope.stepList[i].stepInputs[key][j].sourceId) {
                      $scope.stepList[i].stepInputs[key][j].sourceId = $scope.squishedRecipeName + k;
                      break;
                    }
                  }
                }
              }
            } else {
              var list = $scope.stepList;
              if($scope.stepList[i].stepInputs[key].sourceId) {
                for (var j = list.length - 1; j >= 0; j--) {
                  if(list[j].stepId === $scope.stepList[i].stepInputs[key].sourceId){
                    $scope.stepList[i].stepInputs[key].sourceId = $scope.squishedRecipeName + j;
                    break;
                  }
                }
              }
            }
          }
        }
      }
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
          inputCategory: typeIngredient.inputCategory,
          _id: typeIngredient._id
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
      if(confirm('Are You Sure You Want To reset?')) {
        $window.location.reload(true);
      }
    };

    $scope.save = function() {
      $scope.recipe.ingredientList = $scope.ingredientList;
      $scope.recipe.stepList = $scope.stepList;
      if(!$scope.recipe.canAddSeasoningProfile){
        $scope.recipe.canAddSeasoningProfile = false;
      }
      if(!$scope.recipe.choiceSeasoningProfiles) {
        $scope.recipe.choiceSeasoningProfiles = [];
      }
      for (var i = $scope.seasoningProfiles.length - 1; i >= 0; i--) {
        if($scope.seasoningProfiles[i].useInChoiceSeasonings) {
          delete $scope.seasoningProfiles[i].useInChoiceSeasonings;
          $scope.recipe.choiceSeasoningProfiles.push($scope.seasoningProfiles[i]);
        }
      }
      if(!$scope.recipe.collectionIds) {
        $scope.recipe.collectionIds = [];
      }
      for (var i = $scope.recipeCollections.length - 1; i >= 0; i--) {
        if($scope.recipeCollections[i].useInRecipe) {
          delete $scope.recipeCollections[i].useInRecipe;
          $scope.recipe.collectionIds.push($scope.recipeCollections[i]._id);
        }
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
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
      $window.location.reload(true);
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
      if(!$scope.recipe.choiceSeasoningProfiles) {
        $scope.recipe.choiceSeasoningProfiles = [];
      }
      for (var i = $scope.seasoningProfiles.length - 1; i >= 0; i--) {
        if($scope.seasoningProfiles[i].useInChoiceSeasonings) {
          delete $scope.seasoningProfiles[i].useInChoiceSeasonings;
          $scope.recipe.choiceSeasoningProfiles.push($scope.seasoningProfiles[i]);
        }
      }
      if(!$scope.recipe.collectionIds) {
        $scope.recipe.collectionIds = [];
      }
      for (var i = $scope.recipeCollections.length - 1; i >= 0; i--) {
        if($scope.recipeCollections[i].useInRecipe) {
          delete $scope.recipeCollections[i].useInRecipe;
          $scope.recipe.collectionIds.push($scope.recipeCollections[i]._id);
        }
      }
    };
  }]);
