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

        scope.removeTypes = ["Remove"];

        scope.composingTypes = [];

        function fillComposingTypes(input) {
          if(input.sourceType === 'IngredientList') {
            for (var i = scope.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
              var type = scope.ingredientList.ingredientTypes[i];
              if(type === input.key) {
                scope.composingTypes.push(scope.ingredientList.ingredientTypes[i]);
              }
            }
          } else if(input.sourceType === 'EquipmentList') {
            for (var j = scope.ingredientList.equipmentNeeded.length - 1; j >= 0; j--) {
              var dish = scope.ingredientList.equipmentNeeded[j];
              if(dish.name === input.key) {
                scope.inputDish = dish;
              }
            }
          } else {
            //find previous step
            for (var k = scope.stepList.length - 1; k >= 0; k--) {
              if(scope.stepList[k].stepId === input.sourceId) {
                //do I need to specifically get product keys? I don't think so... just aggregate
                //Actually, will need to worry about in the remove case... imagine that you have a Remove step that partially feeds a Cook step that then the Remove step then uses...
                //So what could be done: we get the Cook step; we loop through all of the stepInputs; one of which is the Remove step; we only want a subset of the things partitioned on the remove step; seems like we need RemoveStep specific information
                //AS IF: a RemoveStep was a basecase - would want to know if RemoveStep and then what key was being accessed
                //Will need to design the products of removeSteps more specifically before the immediate implementation of this
              }
            }
          }
        }

        function fillComposingTypesWrapper() {
          var stepInput = scope.constructingStep.stepInputs['stepInput'];
          fillComposingTypes(stepInput);
        }

        //event based filling of scope.composingTypes
        scope.$on('stepInputPropertyChange', function(event) {
          event.preventDefault();
          fillComposingTypesWrapper();
        });

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
