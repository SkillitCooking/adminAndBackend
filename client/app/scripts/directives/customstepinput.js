'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:customStepInput
 * @description
 * # customStepInput
 */
angular.module('SkillitAdminApp')
  .directive('customStepInput', function () {
    return {
      templateUrl: 'views/customstepinput.html',
      restrict: 'E',
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
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
