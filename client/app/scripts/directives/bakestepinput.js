'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:bakeStepInput
 * @description
 * # bakeStepInput
 */
angular.module('SkillitAdminApp')
  .directive('bakeStepInput', function () {
    return {
      templateUrl: 'views/bakestepinput.html',
      restrict: 'E',
      transclude: false,
      scope: true,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.showExampleText = false;
        scope.tipAdded = false;
        scope.tipIsMinimized = true;

        scope.auxiliaryStepTypeNames = [];

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
            propName: "bakingTime",
            val: ""
          }];
        }

        scope.removeAuxStep = function(index) {
          scope.constructingStep.auxiliarySteps.splice(index,1);
        };

        scope.addAuxStep = function() {
          if(!scope.constructingStep.auxiliarySteps){
            scope.constructingStep.auxiliarySteps = [];
          }
          scope.constructingStep.auxiliarySteps.push({
            stepSpecifics: [{
              propName: "whenToStir",
              val: ""
            }, {
              propName: "stirType",
              val: ""
            }]
          });
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
