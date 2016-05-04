'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:cutStepInput
 * @description
 * # cutStepInput
 */


angular.module('SkillitAdminApp')
  .directive('cutStepInput', function () {
    return {
      templateUrl: '../views/cutstepinput.html',
      scope: true,
      transclude: false,
      restrict: 'E',
      link: function(scope, elem, attrs) {
        scope.showExampleText = false;
        scope.integerval = /^\d*$/;
        scope.tipAdded = false;
        scope.actionTypes = ["Cut", "Chop", "Dice", "Slice", "Mince"];

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
