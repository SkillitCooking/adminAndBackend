'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:removeStepInput
 * @description
 * # removeStepInput
 */
angular.module('SkillitAdminApp')
  .directive('removeStepInput', function (utility) {
    return {
      templateUrl: 'views/removestepinput.html',
      restrict: 'E',
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.tipAdded = false;
        scope.tipIsMinimized = true;
        scope.showExampleText = false;

        scope.removeTypes = ["Remove"];

        scope.composingTypes = [];
        if(!scope.constructingStep.productNames) {
          scope.constructingStep.productNames = [];
        }
        if(!scope.constructingStep.stepComposition) {
          scope.constructingStep.stepComposition = {};
        }

        if(scope.constructingStep.stepInputs && scope.constructingStep.stepInputs['stepInput']) {
          fillComposingTypesWrapper();
        }

        function fillIngredientTypes(key) {
          for (var i = scope.recipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
            var type = scope.recipe.ingredientList.ingredientTypes[i];
            if(type.typeName === key) {
              scope.composingTypes.push(scope.recipe.ingredientList.ingredientTypes[i]);
            }
          }
        }

        function fillDish(key) {
          for (var j = scope.recipe.ingredientList.equipmentNeeded.length - 1; j >= 0; j--) {
            var dish = scope.recipe.ingredientList.equipmentNeeded[j];
            if(dish.name === key) {
              scope.inputDish = dish;
            }
          }
        }

        function fillComposingTypes(input) {
          //need to handle case where input is an array!
          if(input.sourceType === 'IngredientList') {
            fillIngredientTypes(input.key);
          } else if(input.sourceType === 'EquipmentList') {
            fillDish(input.key);
          } else {
            //find previous step
            for (var k = scope.recipe.stepList.length - 1; k >= 0; k--) {
              if(scope.recipe.stepList[k].stepId === input.sourceId) {
                //what is structure of inputs in step?
                //check for remove step
                if(scope.recipe.stepList[k].stepType === "Remove") {
                  //then special base case handling
                  //what removed type or dishAndRemaining being used?
                  //then dish + ingredients
                  if(input.type === 'dish') {
                    fillDish(input.dishKey);
                  }
                  for (var m = input.ingredientTypeKeys.length - 1; m >= 0; m--) {
                    fillIngredientTypes(input.ingredientTypeKeys[m]);
                  }
                } else {
                  var inputKeys = utility.getInputKeys(scope.recipe.stepList[k].stepType);
                  for (var l = inputKeys.length - 1; l >= 0; l--) {
                    var stepInput = scope.recipe.stepList[k].stepInputs[inputKeys[l]];
                    //check for typeof array here, and then iterate over
                    if(Array.isArray(stepInput)) {
                      for (var i = stepInput.length - 1; i >= 0; i--) {
                        fillComposingTypes(stepInput[i]);
                      }
                    } else {
                      fillComposingTypes(stepInput);    
                    }
                  }
                }
              }
            }
          }
        }

        function ingredientTypeCmpFn(typeA, typeB) {
          if(typeA.typeName === typeB.typeName) {
            return true;
          } else {
            return false;
          }
        }

        function trimComposingTypes() {
          scope.composingTypes = utility.removeDuplicates(scope.composingTypes, ingredientTypeCmpFn);
        }

        function assignRankingsToComposingTypes() {
          for (var i = scope.composingTypes.length - 1; i >= 0; i--) {
            scope.composingTypes[i].insertionRanking = i;
          }
        }

        function fillComposingTypesWrapper() {
          var stepInput = scope.constructingStep.stepInputs['stepInput'];
          fillComposingTypes(stepInput);
          trimComposingTypes();
          assignRankingsToComposingTypes();
        }

        //event based filling of scope.composingTypes
        scope.$on('stepInputPropertyChange', function(event) {
          event.preventDefault();
          fillComposingTypesWrapper();
        });

        if(scope.constructingStep.stepId) {
          scope.constructingStep.productName = scope.constructingStep.productKeys[0];
          if(scope.constructingStep.stepTip) {
            scope.tipAdded = true;
          }
        } else {
          scope.constructingStep.stepSpecifics = [{
            propName: "removeType",
            val: ""
          }];
        }

        scope.toggleTipVisibility = function() {
          scope.tipIsMinimized = !scope.tipIsMinimized;
        };

        scope.getTipToggleText = function() {
          if(scope.tipIsMinimized) {
            return 'Expand';
          } else {
            return 'Minimize';
          }
        };

        scope.addTip = function() {
          scope.tipAdded = !scope.tipAdded;
          scope.tipIsMinimized = false;
          scope.stepTip = {
            videoInfo: {}
          };
        };

        scope.removeTip = function() {
          scope.tipAdded = !scope.tipAdded;
          scope.constructingStep.stepTip = undefined;
        };        
      }
    };
  });
