'use strict';

/**
 * @ngdoc function
 * @name SkillitAdminApp.controller:RecipeCtrl
 * @description
 * # RecipeCtrl
 * Controller of the SkillitAdminApp
 */
angular.module('SkillitAdminApp')
  .controller('RecipeCtrl', ['$scope', 'recipeService', '_', function ($scope, recipeService, _) {
    $scope.integerval = /^\d*$/;

    $scope.stepTypes = ["Bake", "Boil", "BringToBoil", "Cut", "Dry", "Heat", "Place", "PreheatOven", "Sautee", "Season", "SlowCook", "Steam", "EquipmentPrep", "Stir"];
    $scope.recipeTypes = ["testType1", "testType2", "testType3"];
    $scope.recipeCategories = ["testCategory1", "testCategory2", "testCategory3"];
    $scope.cookingMethods = ["Bake", "Sautee", "Boil", "Steam", "SlowCook"];
    $scope.seasoningProfiles = [
      {
        name: "testProfile1",
        spices: ["spice1", "spice2"]
      },
      {
        name: "testProfile2",
        spices: ["spice3", "spice4"]
      }
    ];
    $scope.ingredients = [
      {
        name: "ingredient1",
        ingredientForms: [{name: "form1"},{name: "form2"}]
      },
      {
        name: "ingredient2",
        ingredientForms: [{name: "form3"},{name: "form4"}]
      },
      {
        name: "ingredient3",
        ingredientForms: [{name: "form5"},{name: "form6"}]
      }
    ];
    $scope.dishes = [
      {name: "dish1"}, {name: "dish2"}, {name: "dish3"}
    ];
    $scope.selectedIngredientForms = [];

    $scope.ingredientList = {
      ingredientTypes: [
        {typeName: "fakeType", ingredients: [$scope.ingredients[0]], minNeeded: "1"}
      ],
      equipmentNeeded: [$scope.dishes[0]]
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
      if($scope.selectedIngredientForms.length == 0){
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
          ingredientTips: typeIngredient.ingredientTips
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
        ingredients: [],
        minNeeded: ""
      });
    };

    $scope.addDish = function() {
      if($scope.ingredientList.equipmentNeeded.indexOf($scope.typeDish) === -1){
        $scope.ingredientList.equipmentNeeded.push($scope.typeDish);
      }
    };

    $scope.removeDish = function(index) {
      $scope.ingredientList.equipmentNeeded.splice(index, 1);
    };

    $scope.addStep = function() {
      $scope.constructingStep.stepId = _.uniqueId($scope.constructingStep.stepType);
      $scope.stepList.push($scope.constructingStep);
      $scope.constructingStep = undefined;
    };

    $scope.removeStep = function() {

    };
  }]);
