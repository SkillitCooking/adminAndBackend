'use strict';


/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:EditrecipesCtrl
 * @description
 * # EditrecipesCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('EditRecipesCtrl', ['$window', '$scope', 'compatibilityService', 'recipeService', 'itemCollectionService', 'seasoningService', 'ingredientService', 'dishService', 'healthModifierService', 'recipeAdjectiveService', 'utility', function ($window, $scope, compatibilityService, recipeService, itemCollectionService, seasoningService, ingredientService, dishService, healthModifierService, recipeAdjectiveService, utility) {

    $scope.integerval = /^\d*$/;
    $scope.recipeTypes = ["AlaCarte", "BYO", "Full"];
    $scope.recipeCategories = ["Sautee", "Scramble", "Easy Dinners", "Seafood Plates", "Roast", "Pasta", "Hash", "Rice", "Quinoa"];
    $scope.servingSizes = ["1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10"];
    $scope.cookingMethods = ["Bake", "Sautee", "Boil", "Steam", "SlowCook"];
    $scope.stepTypes = ["Bake", "Boil", "BreakEgg", "BringToBoil", "Cook", "Custom", "Cut", "Dry", "EquipmentPrep", "Heat", "Move", "Place", "PreheatOven", "Remove", "Sautee", "Serve", "Season", "SlowCook", "Steam", "Stir"];
    //initialize constructingStep and its stepInputs
    $scope.constructingStep = {};
    $scope.constructingStep.stepInputs = {};
    $scope.selectedIngredientForms = [];
    $scope.selectedRecipe = {};

    $scope.serverType = 'DEVELOPMENT';

    $scope.reloadStuff = function(serverName) {
      var isProd = false;
      if(serverName === 'PRODUCTION') {
        isProd = true;
      }
      $scope.serverType = serverName;
      recipeService.getAllRecipes(isProd).then(function(res) {
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

      itemCollectionService.getItemCollectionsForType('recipe', isProd).then(function(res) {
        $scope.recipeCollections = res.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });

      recipeAdjectiveService.getAllRecipeAdjectives(isProd).then(function(res) {
        $scope.recipeAdjectives = res.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: ", response);
      });

      healthModifierService.getAllHealthModifiers(isProd).then(function(res) {
        $scope.healthModifiers = res.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: ", response);
      });

      seasoningService.getAllSeasonings(isProd).then(function(res) {
        $scope.seasoningProfiles = res.data;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });

      ingredientService.getAllIngredients(isProd).then(function(ingredients) {
        $scope.ingredients = ingredients;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });

      dishService.getAllDishes(isProd).then(function(dishes) {
        $scope.dishes = dishes;
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
      });
    };
    
    $scope.reloadStuff('DEVELOPMENT');

    $scope.reloadRecipes = function() {
      $scope.showSelectRecipe = true;
      recipeService.getAllRecipes(isProd).then(function(res) {
        $scope.recipes = res.data;
      }, function(response){
        console.log('server error', response);
        alert("Server Error: " + response.message);
      });
    };

    $scope.originalName = "";

    $scope.logRecipeName = function() {
      $scope.originalName = $scope.recipe.name;
    };

    $scope.updateRecipeName = function() {
      var nameTokens = $scope.recipe.name.split(" ");
      $scope.squishedRecipeName = nameTokens.join("");
      if($scope.recipe.stepList) {
        for (var i = $scope.recipe.stepList.length - 1; i >= 0; i--) {
          $scope.recipe.stepList[i].stepId = $scope.squishedRecipeName + i;
          //look at inputs, if sourceId, then look up step in shortened array, project stepId
          //for use in sourceId
          for(var key in $scope.recipe.stepList[i].stepInputs) {
            if(Array.isArray($scope.recipe.stepList[i].stepInputs[key])) {
              for (var j = $scope.recipe.stepList[i].stepInputs[key].length - 1; j >= 0; j--) {
                if($scope.recipe.stepList[i].stepInputs[key][j].sourceId) {
                  for (var k = $scope.recipe.stepList.length - 1; k >= 0; k--) {
                    if($scope.recipe.stepList[k].stepId === $scope.recipe.stepList[i].stepInputs[key][j].sourceId) {
                      $scope.recipe.stepList[i].stepInputs[key][j].sourceId = $scope.squishedRecipeName + k;
                      break;
                    }
                  }
                }
              }
            } else {
              var list = $scope.recipe.stepList;
              if($scope.recipe.stepList[i].stepInputs[key].sourceId) {
                for (var j = list.length - 1; j >= 0; j--) {
                  if(list[j].stepId === $scope.recipe.stepList[i].stepInputs[key].sourceId){
                    $scope.recipe.stepList[i].stepInputs[key].sourceId = $scope.squishedRecipeName + j;
                    break;
                  }
                }
              }
            }
          }
        }
      }
    };

    $scope.addNameBody = function() {
      if(!$scope.nameBodies) {
        $scope.nameBodies = [];
      }
      $scope.nameBodies.push({});
    };

    $scope.removeNameBody = function(index) {
      var name = $scope.nameBodies[index].name;
      for(var key in $scope.nameDictionary) {
        for (var i = $scope.nameDictionary[key].textArr.length - 1; i >= 0; i--) {
          if($scope.nameDictionary[key].textArr[i] === name) {
            $scope.nameDictionary[key].textArr.splice(i, 1);
            if($scope.nameDictionary[key].textArr.length === 0) {
              delete $scope.nameDictionary[key];
            }
          }
        }
      }
      $scope.nameBodies.splice(index, 1);
    };

    $scope.addDescription = function() {
      if(!$scope.conditionalDescriptions) {
        $scope.conditionalDescriptions = [];
      }
      $scope.conditionalDescriptions.push({});
    };

    $scope.removeDescription = function(index) {
      var description = $scope.conditionalDescriptions[index].description;
      for(var key in $scope.descriptionDictionary) {
        for (var i = $scope.descriptionDictionary[key].textArr.length - 1; i >= 0; i--) {
          if($scope.descriptionDictionary[key].textArr[i] === description) {
            $scope.descriptionDictionary[key].textArr.splice(i, 1);
            if($scope.descriptionDictionary[key].textArr.length === 0) {
              delete $scope.descriptionDictionary[key];
            }
          }
        }
      }
      $scope.conditionalDescriptions.splice(index, 1);
    };

    function updateNamesAndDescriptions() {
      $scope.nameBodies = angular.copy([]);
      $scope.conditionalDescriptions = angular.copy([]);
      var nameMap = {};
      var descriptionMap = {};
      for(var key in $scope.recipe.nameBodies) {
        for (var i = $scope.recipe.nameBodies[key].textArr.length - 1; i >= 0; i--) {
          if(!nameMap[$scope.recipe.nameBodies[key].textArr[i]]) {
            nameMap[$scope.recipe.nameBodies[key].textArr[i]] = true;
          }
        }
        
      }
      for(var key in $scope.recipe.conditionalDescriptions) {
        for (var j = $scope.recipe.conditionalDescriptions[key].textArr.length - 1; j >= 0; j--) {
          if(!descriptionMap[$scope.recipe.conditionalDescriptions[key].textArr[j]]) {
            descriptionMap[$scope.recipe.conditionalDescriptions[key].textArr[j]] = true;
          }
        }
      }
      for(var name in nameMap) {
        $scope.nameBodies.push({name: name});
      }
      for(var description in descriptionMap) {
        $scope.conditionalDescriptions.push({description: description});
      }
      $scope.nameDictionary = angular.copy($scope.recipe.nameBodies);
      if(!$scope.nameDictionary) {
        $scope.nameDictionary = {};
      }
      $scope.descriptionDictionary = angular.copy($scope.recipe.conditionalDescriptions);
      if(!$scope.descriptionDictionary) {
        $scope.descriptionDictionary = {};
      }
    }

    $scope.changeSelectedRecipe = function() {
      if($scope.selectedRecipe && $scope.selectedRecipe.name) {
        $scope.selectedRecipeIndex = $scope.recipes.indexOf($scope.selectedRecipe);
        $scope.recipe = angular.copy($scope.selectedRecipe);
        updateNamesAndDescriptions();
        $scope.ingredientList = $scope.recipe.ingredientList;
        $scope.mainPictureURLs = angular.copy([]);
        console.log('recipe', $scope.recipe);
        if($scope.recipe.mainPictureURLs) {
          for (var i = 0; i < $scope.recipe.mainPictureURLs.length; i++) {
            $scope.mainPictureURLs.push({url: $scope.recipe.mainPictureURLs[i]});
          }
        }
        $scope.stepList = $scope.recipe.stepList;
        console.log('stepList', $scope.stepList);
        $scope.typeMinimizedIndicatorArray = new Array($scope.recipe.ingredientList.ingredientTypes.length);
        $scope.typeMinimizedIndicatorArray.fill(true);
        $scope.stepMinimizedIndicatorArray = new Array($scope.stepList.length);
        $scope.stepMinimizedIndicatorArray.fill(true);
        var types = $scope.recipe.ingredientList.ingredientTypes;
        for (var i = types.length - 1; i >= 0; i--) {
          types[i].ingredientMinimizedIndicator = new Array(types[i].ingredients.length);
          types[i].ingredientMinimizedIndicator.fill(true);
        }
        if($scope.recipeCollections) {
          for (var i = $scope.recipe.collectionIds.length - 1; i >= 0; i--) {
            var index = _.findIndex($scope.recipeCollections, function(collection) {
              return collection._id === $scope.recipe.collectionIds[i];
            });
            if(index > -1) {
              $scope.recipeCollections[index].useInRecipe = true;
            }
          }
        }
        if($scope.seasoningProfiles) {
          for (var i = $scope.recipe.choiceSeasoningProfiles.length - 1; i >= 0; i--) {
            var index = _.findIndex($scope.seasoningProfiles, function(profile) {
              return profile._id === $scope.recipe.choiceSeasoningProfiles[i]._id;
            });
            if(index > -1) {
              $scope.seasoningProfiles[index].useInChoiceSeasonings = true;
            }
          }
        }
      }
    };

    $scope.removeCollection = function(index) {
      $scope.recipe.collectionIds.splice(index, 1);
    };

    $scope.addCollection = function() {
      $scope.recipe.collectionIds.push($scope.curCollectionId);
    };

    $scope.removePictureURL = function(index) {
      $scope.mainPictureURLs.splice(index, 1);
    };

    $scope.addPictureURL = function() {
      console.log('pics', $scope.mainPictureURLs);
      $scope.mainPictureURLs.push({});
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
        $scope.recipe.ingredientList.ingredientTypes[typeIndex].ingredientMinimizedIndicator.push(true);
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
        minNeeded: "",
        ingredientMinimizedIndicator: []
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
      if($scope.constructingStep.productNames) {
        $scope.constructingStep.productKeys = utility.pickArray($scope.constructingStep.productNames, 'name');
        $scope.constructingStep.productNames = undefined;
      } else {
        $scope.constructingStep.productKeys = [$scope.constructingStep.productName];
        $scope.constructingStep.productName = undefined;
      }
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

    function computeAllowablePrefixIds() {
      var descriptionIds = Object.keys($scope.descriptionDictionary);
      var nameIds = Object.keys($scope.nameDictionary);
      nameIds = nameIds.concat(descriptionIds);
      var prefixIds = Array.from(new Set(nameIds));
      console.log('prefixIds', prefixIds);
      return prefixIds;
    }

    $scope.saveChanges = function() {
      $scope.recipe.choiceSeasoningProfiles = [];
      for (var i = $scope.seasoningProfiles.length - 1; i >= 0; i--) {
        if($scope.seasoningProfiles[i].useInChoiceSeasonings) {
          delete $scope.seasoningProfiles[i].useInChoiceSeasonings;
          $scope.recipe.choiceSeasoningProfiles.push($scope.seasoningProfiles[i]);
        }
      }
      $scope.recipe.collectionIds = [];
      for (var i = $scope.recipeCollections.length - 1; i >= 0; i--) {
        if($scope.recipeCollections[i].useInRecipe) {
          delete $scope.recipeCollections[i].useInRecipe;
          $scope.recipe.collectionIds.push($scope.recipeCollections[i]._id);
        }
      }
      var allowablePrefixIds = computeAllowablePrefixIds();
      for (var i = $scope.mainPictureURLs.length - 1; i >= 0; i--) {
        $scope.mainPictureURLs[i] = $scope.mainPictureURLs[i].url;
      }
      var compatibilityVersion = compatibilityService.getVersion($scope.recipe);
      recipeService.updateRecipe({
        name: $scope.recipe.name,
        nameBodies: $scope.nameDictionary,
        description: $scope.recipe.description,
        conditionalDescriptions: $scope.descriptionDictionary,
        allowablePrefixIds: allowablePrefixIds,
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
        mainPictureURL: $scope.mainPictureURLs[0],
        mainPictureURLs: $scope.mainPictureURLs,
        mainVideo: $scope.recipe.mainVideo,
        prepTime: $scope.recipe.prepTime,
        totalTime: $scope.recipe.totalTime,
        manActiveTime: $scope.recipe.manActiveTime,
        manTotalTime: $scope.recipe.manTotalTime,
        hasBeenRecipeOfTheDay: $scope.recipe.hasBeenRecipeOfTheDay,
        datesUsedAsRecipeOfTheDay: $scope.recipe.datesUsedAsRecipeOfTheDay,
        isRecipeOfTheDay: $scope.recipe.isRecipeOfTheDay,
        _id: $scope.recipe._id,
        compatibilityVersion: compatibilityVersion
      }, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        alert("Recipe successfully updated!");
        //$window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        //$window.location.reload(true);
      });
    };

    $scope.deleteRecipe = function() {
      recipeService.deleteRecipe({_id: $scope.recipe._id}, $scope.useProdServer, $scope.useDevServer).then(function(res) {
        alert("Recipe successfully deleted");
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.noRecipeNameChange = function() {
      if($scope.recipe) {
        return $scope.originalName === $scope.recipe.name;
      }
      return true;
    };

    $scope.duplicateRecipe = function() {
      delete $scope.recipe.ingredientList._id;
      for (var i = $scope.recipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
        delete $scope.recipe.ingredientList.ingredientTypes[i]._id;
      }
      for (var i = $scope.recipe.stepList.length - 1; i >= 0; i--) {
        delete $scope.recipe.stepList[i]._id;
        for (var j = $scope.recipe.stepList[i].stepSpecifics.length - 1; j >= 0; j--) {
          delete $scope.recipe.stepList[i].stepSpecifics[j]._id;
        }
        for (var j = $scope.recipe.stepList[i].auxiliarySteps.length - 1; j >= 0; j--) {
          delete $scope.recipe.stepList[i].auxiliarySteps[j]._id;
        }
      }
      $scope.recipe.choiceSeasoningProfiles = [];
      for (var i = $scope.seasoningProfiles.length - 1; i >= 0; i--) {
        if($scope.seasoningProfiles[i].useInChoiceSeasonings) {
          delete $scope.seasoningProfiles[i].useInChoiceSeasonings;
          $scope.recipe.choiceSeasoningProfiles.push($scope.seasoningProfiles[i]);
        }
      }
      $scope.recipe.collectionIds = [];
      for (var i = $scope.recipeCollections.length - 1; i >= 0; i--) {
        if($scope.recipeCollections[i].useInRecipe) {
          delete $scope.recipeCollections[i].useInRecipe;
          $scope.recipe.collectionIds.push($scope.recipeCollections[i]._id);
        }
      }
      for (var i = $scope.mainPictureURLs.length - 1; i >= 0; i--) {
        $scope.mainPictureURLs[i] = $scope.mainPictureURLs[i].url;
      }
      var allowablePrefixIds = computeAllowablePrefixIds();
      var compatibilityVersion = compatibilityService.getVersion($scope.recipe);
      recipeService.addNewRecipe({
        recipe: {
          name: $scope.recipe.name,
          nameBodies: $scope.nameDictionary,
          allowablePrefixIds: allowablePrefixIds,
          description: $scope.recipe.description,
          conditionalDescriptions: $scope.descriptionDictionary,
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
          mainPictureURL: $scope.mainPictureURLs[0],
          mainPictureURLs: $scope.mainPictureURLs,
          mainVideo: $scope.recipe.mainVideo,
          prepTime: $scope.recipe.prepTime,
          totalTime: $scope.recipe.totalTime,
          manActiveTime: $scope.recipe.manActiveTime,
          manTotalTime: $scope.recipe.manTotalTime,
          hasBeenRecipeOfTheDay: false,
          datesUsedAsRecipeOfTheDay: [],
          isRecipeOfTheDay: false,
          compatibilityVersion: compatibilityVersion
        }
      }, $scope.useProdServer, $scope.useDevServer).then(function(recipe) {
        alert('Success! Recipe ' + recipe[0].name + 'was saved! Refresh form.');
        $window.location.reload(true);
      }, function(response) {
        console.log("Server Error: ", response);
        alert("Server Error: " + response.message);
        $window.location.reload(true);
      });
    };

    $scope.noServerSelected = function() {
      return !$scope.useProdServer && !$scope.useDevServer;
    };

  }]);
