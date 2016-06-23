'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:cookstepinput
 * @description
 * # cookstepinput
 */
angular.module('SkillitAdminApp')
  .directive('cookStepInput', function () {
    return {
      templateUrl: 'views/cookstepinput.html',
      scope: true,
      transclude: false,
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.tipAdded = false;
        scope.showExampleText = false;
        scope.cookTypes = ["Cook"];

        scope.constructingStep.stepSpecifics = [{
          propName: "cookType",
          val: ""
        }, {
          propName: "cookDuration",
          val: ""
        }, {
          propName: "cookAccordingToInstructions",
          val: false
        }];

        scope.addTip = function() {
          scope.tipAdded = !scope.tipAdded;
        };
        scope.removeTip = function () {
          scope.tipAdded = !scope.tipAdded;
          scope.constructingStep.stepTip = undefined;
        };
      }
    };
  });