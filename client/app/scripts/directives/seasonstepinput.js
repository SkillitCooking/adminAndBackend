'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:seasonStepInput
 * @description
 * # seasonStepInput
 */
angular.module('SkillitAdminApp')
  .directive('seasonStepInput', function () {
    return {
      templateUrl: '../views/seasonstepinput.html',
      restrict: 'E',
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.showExampleText = false;
        scope.tipAdded = false;
        scope.constructingStep.isOil = false;
        scope.constructingStep.isSeason = false;

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
