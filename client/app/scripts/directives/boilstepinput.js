'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:boilStepInput
 * @description
 * # boilStepInput
 */
angular.module('SkillitAdminApp')
  .directive('boilStepInput', function () {
    return {
      templateUrl: 'views/boilstepinput.html',
      restrict: 'E',
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.showExampleText = false;
        scope.tipAdded = false;

        scope.constructingStep.cookAccordingToInstructions = false;

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
