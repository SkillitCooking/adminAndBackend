'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:cutStepInput
 * @description
 * # cutStepInput
 */


angular.module('SkillitAdminApp')
  .directive('cutStepInput', function () {
    return {
      templateUrl: 'views/cutstepinput.html',
      scope: true,
      transclude: false,
      restrict: 'E',
      link: function(scope, elem, attrs) {
        scope.showExampleText = false;
        scope.integerval = /^\d*$/;
        scope.tipAdded = false;
        scope.tipIsMinimized = true;
        scope.actionTypes = ["Cut", "Chop", "Dice", "Slice", "Mince"];

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
            propName: "actionType",
            val: ""
          }, {
            propName: "actionModifier",
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
