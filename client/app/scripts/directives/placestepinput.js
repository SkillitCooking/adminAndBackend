'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:placeStepInput
 * @description
 * # placeStepInput
 */
angular.module('SkillitAdminApp')
  .directive('placeStepInput', function () {
    return {
      templateUrl: '../views/placestepinput.html',
      restrict: 'E',
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.showExampleText = false;
        scope.tipAdded = false;

        scope.addTip = function() {
          console.log(scope.stepList);
          scope.tipAdded = !scope.tipAdded;
        };
        scope.removeTip = function() {
          scope.tipAdded = !scope.tipAdded;
          scope.constructingStep.stepTip = undefined;
        }
      }
    };
  });
