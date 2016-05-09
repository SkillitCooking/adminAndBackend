'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:equipmentPrepStepInput
 * @description
 * # equipmentPrepStepInput
 */
angular.module('SkillitAdminApp')
  .directive('equipmentPrepStepInput', function () {
    return {
      templateUrl: 'views/equipmentprepstepinput.html',
      restrict: 'E',
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.showExampleText = false;
        scope.tipAdded = false;

        scope.prepActionTypes = ["Grease", "Line"];

        scope.constructingStep.stepSpecifics = [{
          propName: "prepActionType",
          val: ""
        },
        {
          propName: "prepModifier",
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
