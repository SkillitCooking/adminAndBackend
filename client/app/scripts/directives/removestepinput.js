'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:removeStepInput
 * @description
 * # removeStepInput
 */
angular.module('SkillitAdminApp')
  .directive('removeStepInput', function () {
    return {
      templateUrl: 'views/removestepinput.html',
      restrict: 'E',
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.integerval = /^\d*$/;
        scope.tipAdded = false;
        scope.tipIsMinimized = true;
        scope.showExampleText = false;

        if(scope.constructingStep.stepId) {
          scope.constructingStep.productName = scope.constructingStep.productKeys[0];
          if(scope.constructingStep.stepTip) {
            scope.tipAdded = true;
          }
        } else {
          scope.constructingStep.stepSpecifics = [{
            propName: "removeType",
            val: ""
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
