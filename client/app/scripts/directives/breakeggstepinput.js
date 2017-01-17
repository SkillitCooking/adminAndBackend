'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:breakEggStepInput
 * @description
 * # breakEggStepInput
 */
angular.module('SkillitAdminApp')
  .directive('breakEggStepInput', function () {
    return {
      templateUrl: 'views/breakeggstepinput.html',
      restrict: 'E',
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.tipAdded = false;
        scope.tipIsMinimized = true;
        scope.showExampleText = false;

        if(scope.constructingStep.stepId) {
          //step already exists
          scope.constructingStep.productName = scope.constructingStep.productKeys[0];
          if(scope.constructingStep.stepTip) {
            //then existing tip
            scope.tipAdded = true;
          }
        } else {
          //then new step, needs initialization
          scope.constructingStep.stepSpecifics = [{
            propName: "isWhisk",
            val: false
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
