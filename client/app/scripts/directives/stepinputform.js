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
        stepList: "=stepList"
      },
      transclude: false,
      link: function(scope, elem, attrs) {
        scope.sourceTypes = ["EquipmentList", "StepProduct", "IngredientList"];
        scope.showStepId = function() {
          if(!scope.step[scope.stepInputName] || !scope.step[scope.stepInputName].sourceType){
            return false;
          }
          if(scope.step[scope.stepInputName].sourceType === 'StepProduct'){
            return true;
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

        scope.registerSourceId = function(sourceIdStep) {
          scope.step[scope.stepInputName].sourceId = sourceIdStep.stepId;
        };

        scope.registerSourceIdMultiple = function(input, index, sourceIdStep) {
          input.sourceId = sourceIdStep[index].stepId;
        };

        scope.removeInput = function(index) {
          scope.step[scope.stepInputName].splice(index,1);
        };

        scope.addInput = function() {
          if(!scope.step[scope.stepInputName]){
            scope.step[scope.stepInputName] = [];
          }
          scope.step[scope.stepInputName].push({
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