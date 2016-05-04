'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:dryStepInput
 * @description
 * # dryStepInput
 */
angular.module('SkillitAdminApp')
  .directive('dryStepInput', function () {
    return {
      templateUrl: '../views/drystepinput.html',
      restrict: 'E',
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.dryMethods = ["Pat", "Rub"];
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
