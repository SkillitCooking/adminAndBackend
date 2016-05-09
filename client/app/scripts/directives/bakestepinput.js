'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:bakeStepInput
 * @description
 * # bakeStepInput
 */
angular.module('SkillitAdminApp')
  .directive('bakeStepInput', function () {
    return {
      templateUrl: 'views/bakestepinput.html',
      restrict: 'E',
      transclude: false,
      scope: true,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;

        scope.auxiliaryStepTypeNames = [];
        scope.constructingStep.stepSpecifics = [{
          propName: "bakingTime",
          val: ""
        }];

        scope.showExampleText = false;
        scope.tipAdded = false;

        scope.removeAuxStep = function(index) {
          scope.constructingStep.auxiliarySteps.splice(index,1);
        };

        scope.addAuxStep = function() {
          if(!scope.constructingStep.auxiliarySteps){
            scope.constructingStep.auxiliarySteps = [];
          }
          scope.constructingStep.auxiliarySteps.push({
            stepSpecifics: [{
              propName: "whenToStir",
              val: ""
            }, {
              propName: "stirType",
              val: ""
            }]
          });
        };

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
