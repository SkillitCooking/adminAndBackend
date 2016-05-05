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
        scope.showExampleText = false;

        scope.addTip = function() {
          scope.tipAdded = !scope.tipAdded;
        };

        scope.removeTip = function() {
          scope.tipAdded = !scope.tipAdded;
          scope.constructingStep.stepTip = undefined;
        };
      }
    };
  });
