'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:bringToBoilStepInput
 * @description
 * # bringToBoilStepInput
 */
angular.module('SkillitAdminApp')
  .directive('bringToBoilStepInput', function () {
    return {
      templateUrl: 'views/bringtoboilstepinput.html',
      restrict: 'E',
      transclude: false,
      scope: true,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.tipAdded = false;
        scope.tipIsMinimized = true;
        scope.showExampleText = false;

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
            propName: "waterAmount",
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
