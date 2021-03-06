'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:stepInputForm
 * @description
 * # stepInputForm
 */
angular.module('SkillitAdminApp')
  .directive('stepInputForm', function () {
    return {
      templateUrl: 'views/stepinputform.html',
      restrict: 'E',
      scope: {
        step: "=constructingStep",
        stepInputName: "@inputName",
        isMultiple: "@isMultiple",
        ingredientList: "<ingredientList",
        stepList: "=stepList",
        stepType: "@"
      },
      transclude: false,
      link: function(scope, elem, attrs) {
        scope.sourceTypes = ["EquipmentList", "StepProduct", "IngredientList"];

        scope.getStepFromId = function(stepId) {
          for (var i = scope.stepList.length - 1; i >= 0; i--) {
            if(scope.stepList[i].stepId === stepId) {
              return scope.stepList[i];
            }
          }
        };

        //initialize if step already has been filled in
        if(scope.step.stepId) {
          if(scope.isMultiple === 'false') {
            if(scope.step.stepInputs) {
              if(scope.step.stepInputs[scope.stepInputName].sourceType === 'StepProduct') {
                scope.sourceIdStep = scope.getStepFromId(scope.step.stepInputs[scope.stepInputName].sourceId);
              }
            }
          }
          if(scope.isMultiple === 'true') {
            scope.sourceIdStep = [];
            //need to fill in array style bro
            if(scope.step.stepInputs && scope.step.stepInputs[scope.stepInputName]) {
              for (var i = 0; i <= scope.step.stepInputs[scope.stepInputName].length - 1; i++) {
                if(scope.step.stepInputs[scope.stepInputName][i].sourceType === 'StepProduct') {
                  scope.sourceIdStep[i] = scope.getStepFromId(scope.step.stepInputs[scope.stepInputName][i].sourceId); 
                }
              }
            }
          }
        }
        
        scope.showStepId = function() {
          if(scope.step.stepInputs) {
            if(!scope.step.stepInputs[scope.stepInputName] || !scope.step.stepInputs[scope.stepInputName].sourceType){
              return false;
            }
            if(scope.step.stepInputs[scope.stepInputName].sourceType === 'StepProduct'){
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        };

        scope.showStepIdMultiple = function(input) {
          if(!scope.sourceIdStep){
            scope.sourceIdStep = [];
          }
          if(!input || !input.sourceType) {
            return false;
          }
          if(input.sourceType === 'StepProduct'){
            return true;
          } else {
            return false;
          }
        };

        scope.getSourceIdSelectName = function(step, index) {
          return "Step " + index + " => a " + step.stepType + " step ";
        };

        function stepTypeNeedsChangeLogged() {
          switch(scope.stepType) {
            case 'remove':
              return true;
            default:
              return false;
          }
        }

        scope.stepInputPropertyChange = function() {
          if(scope.step && scope.step.stepInputs && scope.step.stepInputs[scope.stepInputName]) {
            var input = scope.step.stepInputs[scope.stepInputName];
            if(scope.sourceIdStep && input.sourceType === 
              'StepProduct') {
              if(scope.sourceIdStep.stepType === 'Remove') {
                input.ingredientTypeKeys = scope.sourceIdStep.stepComposition[input.key].ingredientTypeKeys;
                if(scope.sourceIdStep.stepComposition[input.key].dish) {
                  input.dishKey = scope.sourceIdStep.stepComposition[input.key].dish.name;
                }
              } else if(input.ingredientTypeKeys) {
                //then need to delete property
                delete input.ingredientTypeKeys;
              }
            } else if(input.ingredientTypeKeys) {
              delete input.ingredientTypeKeys;
            }
            if(stepTypeNeedsChangeLogged()) {
              if(input.sourceId && input.sourceType) {
                scope.$emit('stepInputPropertyChange');
              }
            }
          }
        };

        scope.multipleStepInputPropertyChange = function(input, index) {
          if(scope.step && scope.step.stepInputs && scope.step.stepInputs[scope.stepInputName]) {
            if(scope.sourceIdStep && scope.sourceIdStep[index] && input.sourceType === 'StepProduct') {
              if(scope.sourceIdStep[index].stepType === 'Remove') {
                input.ingredientTypeKeys = scope.sourceIdStep[index].stepComposition[input.key].ingredientTypeKeys;
                if(scope.sourceIdStep[index].stepComposition[input.key].dish) {
                  input.dishKey = scope.sourceIdStep[index].stepComposition[input.key].dish.name;
                }
              } else if(input.ingredientTypeKeys) {
                delete input.ingredientTypeKeys;
              }
            } else if(input.ingredientTypeKeys) {
              delete input.ingredientTypeKeys;
            }
          }
        };

        scope.registerSourceId = function(sourceIdStep) {
          if(sourceIdStep) {
            scope.step.stepInputs[scope.stepInputName].sourceId = sourceIdStep.stepId;
          }
          scope.stepInputPropertyChange();
        };

        scope.registerSourceIdMultiple = function(input, index, sourceIdStep) {
          input.sourceId = sourceIdStep[index].stepId;
        };

        scope.removeInput = function(index) {
          scope.step.stepInputs[scope.stepInputName].splice(index,1);
        };

        scope.addInput = function() {
          if(!scope.step.stepInputs[scope.stepInputName]){
            scope.step.stepInputs[scope.stepInputName] = [];
          }
          scope.step.stepInputs[scope.stepInputName].push({
            sourceType: "",
            sourceId: "",
            key: "",
            inputName: scope.stepInputName
          });
        };

        scope.getProductKeys = function(step) {
          if(step){
            if(step.productKeys){
              return step.productKeys;
            } else {
              return [step.productName];
            }
          }
        };
      }
    };
  });