'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:steamStepInput
 * @description
 * # steamStepInput
 */
angular.module('SkillitAdminApp')
  .directive('steamStepInput', function () {
    return {
      templateUrl: 'views/steamstepinput.html',
      restrict: 'E',
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.showExampleText = false;
        scope.tipAdded = false;
        scope.tipIsMinimized = true;

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
            propName: "steamingDuration",
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
        };

        scope.removeTip = function() {
          scope.tipAdded = !scope.tipAdded;
          scope.constructingStep.stepTip = undefined;
        };
      }
    };
  });
