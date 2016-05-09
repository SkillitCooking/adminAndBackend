'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:sauteeStepInput
 * @description
 * # sauteeStepInput
 */
angular.module('SkillitAdminApp')
  .directive('sauteeStepInput', function () {
    return {
      templateUrl: 'views/sauteestepinput.html',
      restrict: 'E',
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.tipAdded = false;
        scope.showExampleText = false;
        scope.auxStepAdded = false;

        scope.constructingStep.stepSpecifics = [{
          propName: "sauteeDuration",
          val: ""
        }];

        scope.addTip = function() {
          scope.tipAdded = !scope.tipAdded;
        };

        scope.removeTip = function() {
          scope.tipAdded = !scope.tipAdded;
          scope.constructingStep.stepTip = undefined;
        };

        scope.addAuxStep = function() {
          scope.auxStepAdded = !scope.auxStepAdded;
          scope.constructingStep.auxiliarySteps = [{
            stepSpecifics: [{
              propName: "whenToStir",
              val: ""
            }, {
              propName: "stirType",
              val: ""
            }]
          }];
        };

        scope.removeAuxStep = function() {
          scope.auxStepAdded = !scope.auxStepAdded;
          scope.constructingStep.auxiliarySteps = [{
            stepSpecifics: [{
              propName: "whenToStir",
              val: ""
            }, {
              propName: "stirType",
              val: ""
            }]
          }];
        };
      }
    };
  });
