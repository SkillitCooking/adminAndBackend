'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:preheatOvenStepInput
 * @description
 * # preheatOvenStepInput
 */
angular.module('SkillitAdminApp')
  .directive('preheatOvenStepInput', function () {
    return {
      templateUrl: 'views/preheatovenstepinput.html',
      restrict: 'E',
      transclude: false,
      scope: true,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.tipAdded = false;
        scope.showExampleText = false;

        scope.constructingStep.stepSpecifics = [{
          propName: "ovenTemperature",
          val: ""
        }];

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
