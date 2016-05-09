'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:stirStepInput
 * @description
 * # stirStepInput
 */
angular.module('SkillitAdminApp')
  .directive('stirStepInput', function () {
    return {
      templateUrl: 'views/stirstepinput.html',
      restrict: 'E',
      transclude: false,
      scope: {
        isAuxiliaryStep: "@isAuxStep",
        constructingStep: "=",
        ingredientList: "<",
        stepList: "<",
        auxStepArrIndex: "="
      },
      link: function (scope, element, attrs) {
        scope.showExampleText = false;
        scope.integerval = /^\d*$/;

        scope.stirTypes = ["Stir","Flip"];
        scope.tipAdded = false;

        if(scope.auxStepArrIndex){
          scope.auxStepArrIndex = parseInt(scope.auxStepArrIndex, 10);
        }

        if(scope.isAuxiliaryStep === 'false'){
          scope.constructingStep.stepSpecifics = [{
            propName: "whenToStir",
            val: ""
          }, {
            propName: "stirType",
            val: ""
          }];
        }

        scope.isAuxDictionary = function(stepType){
          switch(stepType) {
            case "Bake":
              return true;

            case "Sautee":
              return false;

            default:
              return false;
          }
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
