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
      templateUrl: 'views/seasonstepinput.html',
      restrict: 'E',
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.showExampleText = false;
        scope.tipAdded = false;
        scope.tipIsMinimized = true;

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
            propName: "isOil",
            val: false
          },
          {
            propName: "isSeason",
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
          scope.stepTip = {
            videoInfo: {}
          };
        };

        scope.removeTip = function() {
          scope.tipAdded = !scope.tipAdded;
          scope.constructingStep.stepTip = undefined;
        };
      }
    };
  });
