'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:heatStepInput
 * @description
 * # heatStepInput
 */
angular.module('SkillitAdminApp')
  .directive('heatStepInput', function () {
    return {
      templateUrl: 'views/heatstepinput.html',
      restrict: 'E',
      transclude: false,
      scope: true,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.tipAdded = false;
        scope.showExampleText = false;
        scope.constructingStep.heatsOil = false;

        scope.addTip = function() {
          scope.tipAdded = !scope.tipAdded;
        };

        scope.removeTip = function() {
          scope.tipAdded = !scope.tipAdded;
          scope.constructingStep.stepTip = undefined;
        }
      }
    };
  });
