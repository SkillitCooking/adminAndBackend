'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:reduceHeatStepInput
 * @description
 * # reduceHeatStepInput
 */
angular.module('SkillitAdminApp')
  .directive('reduceHeatStepInput', function () {
    return {
      templateUrl: 'views/reduceheatstepinput.html',
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
        scope.integerval = /^\d*$/;
        scope.tipAdded = false;
        scope.tipIsMinimized = true;
        scope.showExampleText = false;

        if(scope.auxStepArrIndex) {
          scope.auxStepArrIndex = parseInt(scope.auxStepArrIndex, 10);
        }

        if(scope.isAuxiliaryStep === 'false') {
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
              propName: "heatSetting",
              val: ""
            }, {
              propName: "removeFromHeat",
              val: false
            }];
          }
        }

        //may need 'isAuxStepDictionary' method in the future
        //but for now, only handling case of Remove step, which will have
        //only one Auxiliary Step

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
