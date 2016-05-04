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
      templateUrl: '../views/steamstepinput.html',
      restrict: 'E',
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.showExampleText = false;
        scope.tipAdded = false;

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
