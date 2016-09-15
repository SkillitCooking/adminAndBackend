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
      scope: false,
      transclude: false,
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.tipAdded = false;
        scope.tipIsMinimized = true;
        scope.showExampleText = false;
        scope.auxStepAdded = false;
        scope.cookTypes = ["Cook"];

        scope.logStep = function() {
          console.log('constructing Stpe', scope.constructingStep);
        };

        if(scope.constructingStep.stepId) {
          //then step already exists, need to load stepSpecifics, productName
          scope.constructingStep.productName = scope.constructingStep.productKeys[0];
          if(scope.constructingStep.stepTip) {
            //then existing tip
            scope.tipAdded = true;
          }
        } else {
          //then new step, needs appropriate initialization
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
        }

        scope.toggleTipVisibility = function() {
          scope.tipIsMinimized = !scope.tipIsMinimized;
        };

        scope.getTipToggleText = function() {
          if(scope.tipIsMinimized) {
            return 'Expand';
          } else {
            return 'Minimize';
          }
        };

        scope.addTip = function() {
          scope.tipAdded = !scope.tipAdded;
          scope.tipIsMinimized = false;
        };

        scope.removeTip = function () {
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
