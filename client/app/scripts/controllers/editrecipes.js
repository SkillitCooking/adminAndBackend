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
    $scope.stepTypes = ["Bake", "Boil", "BringToBoil", "Cook", "Custom", "Cut", "Dry", "Heat", "Place", "PreheatOven", "Sautee", "Season", "SlowCook", "Steam", "EquipmentPrep", "Stir"];
    //initialize constructingStep and its stepInputs
    $scope.constructingStep = {};
    $scope.constructingStep.stepInputs = {};
    $scope.selectedIngredientForms = [];
    $scope.selectedRecipe = {};
    
    recipeService.getAllRecipes().then(function(res) {
      $scope.recipes = [];
      for (var i = res.data.length - 1; i >= 0; i--) {
        $scope.recipes.push({
          label: res.data[i].name,
          value: res.data[i]
        });
      }
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

    $scope.reloadRecipes = function() {
      $scope.showSelectRecipe = true;
      recipeService.getAllRecipes().then(function(res) {
        $scope.recipes = res.data;
      }, function(response){
        console.log('server error', response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.changeSelectedRecipe = function() {
      if($scope.selectedRecipe && $scope.selectedRecipe.name) {
        $scope.selectedRecipeIndex = $scope.recipes.indexOf($scope.selectedRecipe);
        $scope.recipe = angular.copy($scope.selectedRecipe);
        $scope.ingredientList = $scope.recipe.ingredientList;
        $scope.stepList = $scope.recipe.stepList;
        $scope.typeMinimizedIndicatorArray = new Array($scope.recipe.ingredientList.ingredientTypes.length);
        $scope.typeMinimizedIndicatorArray.fill(true);
        $scope.stepMinimizedIndicatorArray = new Array($scope.stepList.length);
        $scope.stepMinimizedIndicatorArray.fill(true);
        var types = $scope.recipe.ingredientList.ingredientTypes;
        for (var i = types.length - 1; i >= 0; i--) {
          types[i].ingredientMinimizedIndicator = new Array(types[i].ingredients.length);
          types[i].ingredientMinimizedIndicator.fill(true);
        }
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
          inputCategory: typeIngredient.inputCategory,
          _id: typeIngredient._id
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

    $scope.isMinimizedStep = function(index) {
      return $scope.stepMinimizedIndicatorArray[index];
    };

    $scope.toggleStepMinimize = function(index) {
      $scope.stepMinimizedIndicatorArray[index] = !$scope.stepMinimizedIndicatorArray[index];
    };

    $scope.getStepMinimizeButtonText = function(index) {
      if($scope.stepMinimizedIndicatorArray[index]) {
        return 'Expand';
      } else {
        return 'Minimize';
      }
    };

    $scope.removeStep = function(index) {
      $scope.recipe.stepList.splice(index, 1);
      $scope.stepMinimizedIndicatorArray.splice(index, 1);
    };

    $scope.getCurStepNumberFromStepList = function() {
      var lastStep = $scope.recipe.stepList[$scope.recipe.stepList.length - 1];
      var stepNum = "";
      for (var i = lastStep.stepId.length - 1; i >= 0; i--) {
        if(!isNaN(Number(lastStep.stepId.charAt(i)))){
          stepNum = lastStep.stepId.charAt(i) + stepNum;
        } else {
          break;
        }
      }
      return stepNum;
    };

    $scope.addStep = function() {
      if(!$scope.squishedRecipeName){
        var nameTokens = $scope.recipe.name.split(" ");
        $scope.squishedRecipeName = nameTokens.join("");
      }
      if(!$scope.curStepNumber) {
        if(!$scope.recipe.stepList || $scope.recipe.stepList.length === 0) {
          $scope.curStepNumber = 0;
        } else {
          $scope.curStepNumber = $scope.getCurStepNumberFromStepList();
        }
      }
      $scope.curStepNumber += 1;
      $scope.constructingStep.stepId = $scope.squishedRecipeName + $scope.curStepNumber;
      $scope.constructingStep.productKeys = [$scope.constructingStep.productName];
      $scope.constructingStep.productName = undefined;
      $scope.recipe.stepList.push($scope.constructingStep);
      $scope.constructingStep = {};
      $scope.constructingStep.stepInputs = {};
    };

    $scope.recipeSanityCheck = function() {
      if(!$scope.recipe) {
        return false;
      }
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

    $scope.cancelChanges = function() {
      $scope.changeSelectedRecipe();
    };

    $scope.saveChanges = function() {
      recipeService.updateRecipe({
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
        hasBeenRecipeOfTheDay: $scope.recipe.hasBeenRecipeOfTheDay,
        datesUsedAsRecipeOfTheDay: $scope.recipe.datesUsedAsRecipeOfTheDay,
        isRecipeOfTheDay: $scope.recipe.isRecipeOfTheDay,
        _id: $scope.recipe._id
      }).then(function(res) {
        var recipe = {
          label: res.data.name,
          value: res.data
        };
        //doesn't actually have any effect...
        $scope.recipes.splice($scope.selectedRecipeIndex, 1, recipe);
        alert("Recipe successfully updated!");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.deleteRecipe = function() {
      recipeService.deleteRecipe({_id: $scope.recipe._id}).then(function(res) {
        alert("Recipe successfully deleted");
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };

  }]);
