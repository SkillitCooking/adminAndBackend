'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:stirStepInput
 * @description
 * # stirStepInput
 */
angular.module('SkillitAdminApp')
  .directive('stirStepInput', function () {
    return {
      templateUrl: 'views/stirstepinput.html',
      restrict: 'E',
      transclude: false,
      scope: {
        isAuxiliaryStep: "@isAuxStep",
        constructingStep: "=",
        ingredientList: "<",
        stepList: "<",
        auxStepArrIndex: "="
      },
      link: function (scope, element, attrs) {
        scope.showExampleText = false;
        scope.integerval = /^\d*$/;

        scope.stirTypes = ["Stir","Flip"];
        scope.tipAdded = false;
        scope.tipIsMinimized = true;

        if(scope.auxStepArrIndex){
          scope.auxStepArrIndex = parseInt(scope.auxStepArrIndex, 10);
        }

        if(scope.isAuxiliaryStep === 'false'){
          if(scope.constructingStep.stepId) {
            //then step already exists, need to load stepSpecifics, productName
            scope.constructingStep.productName = scope.constructingStep.productKeys[0];
            if(scope.constructingStep.stepTip) {
              //then existing tip
              scope.tipAdded = true;
            }
          } else {
            //then new step, needs appropriate initialization
            scope.constructingStep.stepSpecifics = [{
              propName: "whenToStir",
              val: ""
            }, {
              propName: "stirType",
              val: ""
            }];
          }
        }

        scope.isAuxDictionary = function(stepType){
          switch(stepType) {
            case "Bake":
              return true;

            case "Sautee":
              return false;

            default:
              return false;
          }
        };

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
        };

        scope.removeTip = function() {
          scope.tipAdded = !scope.tipAdded;
          scope.constructingStep.stepTip = undefined;
        };
      }
    };
  });
