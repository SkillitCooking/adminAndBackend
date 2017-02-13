'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.utility
 * @description
 * # utility
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('utility', function () {
    var service = {};

    //want to return keys for:
    //ingredientInput
    //dishInput
    //productInput
    //handling should be agnostic to definition
    
    service.pickArray = function(array, key) {
      return array.map(function(element) {
        return element[key];
      });
    };

    service.propertySort = function(array, propertyName){
      array.sort(function(a, b) {
        if(a[propertyName] < b[propertyName]) {
          return -1;
        } else if(b[propertyName] < a[propertyName]) {
          return 1;
        } else {
          return 0;
        }
      });
    };

    service.isDuplicate = function(array, potentialElement, equalityFn) {
      for (var i = array.length - 1; i >= 0; i--) {
        if(equalityFn) {
          if(equalityFn(array[i], potentialElement)) {
            return true;
          }
        } else {
          if(array[i] === potentialElement) {
            return true;
          }
        }
      }
      return false;
    };

    service.removeDuplicates = function(array, equalityFn) {
      var newArray = [];
      for (var i = array.length - 1; i >= 0; i--) {
        if(newArray.length === 0) {
          newArray.push(array[i]);
        } else {
          var isDuplicate = false;
          for (var j = newArray.length - 1; j >= 0; j--) {
            if(equalityFn(newArray[j], array[i])) {
              //then same
              isDuplicate = true;
              break;
            }
          }
          if(!isDuplicate) {
            newArray.push(array[i]);
          }
        }
      }
      return newArray;
    };

    service.getInputKeys = function(stepType) {
      var inputKeys = [];
      switch(stepType) {
        case "Bake":
          inputKeys.push("productInput");
          break;
        case "Boil":
          inputKeys.push("ingredientInputs");
          inputKeys.push("dishInput");
          break;
        case "BreakEgg":
          inputKeys.push("ingredientInputs");
          inputKeys.push("dishInputs");
          break;
        case "BringToBoil":
          inputKeys.push("dishInput");
          break;
        case "Cook":
          inputKeys.push("ingredientInputs");
          inputKeys.push("dishInput");
          break;
        case "Custom":
          inputKeys.push("ingredientInputs");
          inputKeys.push("dishInputs");
          break;
        case "Cut":
          inputKeys.push("cutIngredientInput");
          break;
        case "Dry":
          inputKeys.push("ingredientInput");
          break;
        case "EquipmentPrep":
          inputKeys.push("dishInputs");
          break;
        case "Heat":
          inputKeys.push("dishInput");
          break;
        case "Move":
          inputKeys.push("stepInput");
          break;
        case "Place":
          inputKeys.push("ingredientInputs");
          inputKeys.push("dishProductInput");
          break;
        case "Remove":
          //shouldn't get here... as Remove is a base case
          break;
        case "Sautee":
          inputKeys.push("ingredientInputs");
          inputKeys.push("dishInput");
          break;
        case "Season":
          inputKeys.push("ingredientInput");
          inputKeys.push("dishInput");
          break;
        case "Serve":
          inputKeys.push("ingredientInputs");
          inputKeys.push("dishInput");
          break;
        case "SlowCook":
          inputKeys.push("ingredientInputs");
          break;
        case "Steam":
          inputKeys.push("ingredientInputs");
          inputKeys.push("dishInput");
          break;
        case "Stir":
          inputKeys.push("stirObjectInput");
          break;
        default:
          break;
      }
      return inputKeys;
    };
 
    return service;
  });
