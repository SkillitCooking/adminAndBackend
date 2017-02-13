'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:removeStepTypeProduct
 * @description
 * # removeStepTypeProduct
 */
angular.module('SkillitAdminApp')
  .directive('removeStepTypeProduct', function (utility) {
    return {
      templateUrl: 'views/removesteptypeproduct.html',
      restrict: 'E',
      scope: {
        indicatorObject: '=',
        constructingStep: '=',
        productName: '='
      },
      transclude: false,
      link: function (scope, element, attrs) {
        //initialization:
        
        //I think the below causes a hanging reference?
        scope.indicators = scope.indicatorObject[scope.productName];
        //this needs to be changed when unchecked/checked in 'types to remove'

        scope.logName = function() {
          scope.currentName = scope.productName;
        };

        scope.commuteNameChanges = function() {
          if(scope.productName !== scope.currentName) {
            //change both indicatorObject and constructingStep.stepComposition
            var composition = angular.copy(scope.constructingStep.stepComposition[scope.currentName]);
            var indicatorArray = angular.copy(scope.indicatorObject[scope.currentName]);
            scope.constructingStep.stepComposition[scope.productName] = composition;
            scope.indicatorObject[scope.productName] = indicatorArray;
            scope.indicators = scope.indicatorObject[scope.productName];
            delete scope.constructingStep.stepComposition[scope.currentName];
            delete scope.indicatorObject[scope.currentName];
            //find currentName in constructingStep.productNames, alter
            for (var i = scope.constructingStep.productNames.length - 1; i >= 0; i--) {
              if(scope.currentName === scope.constructingStep.productNames[i].name) {
                scope.constructingStep.productNames[i].name = scope.productName;
              }
            }
          } 
        };

        scope.onlyOneGroup = function() {
          //then both indicatorObject and constructingStep.stepComposition have only one key
          return Object.keys(scope.indicatorObject).length === 1;
        };

        scope.commuteIndicatorChanges = function(index) {
          //if false, then set 0 or 1 to be true
          //if true, then set all not with productName as key to false
          //also need to set self...
          if(scope.indicators[index]) {
            for(var key in scope.indicatorObject) {
              //not necessarily at the same index...
              var indicatorEntry = scope.indicatorObject[key][index];
              if(key !== scope.productName) {
                indicatorEntry.isSelected = false;
                //need to pass function to findIndex... how to do just for equality?
                var removeIndex = scope.constructingStep.stepComposition[key].ingredientTypeKeys.indexOf(indicatorEntry.name);
                if(removeIndex !== -1) {
                  scope.constructingStep.stepComposition[key].ingredientTypeKeys.splice(removeIndex, 1);
                }
              } else {
                scope.indicatorObject[key][index].isSelected = true;
                //check for inclusion here
                var ingredientTypeKeys = scope.constructingStep.stepComposition[key].ingredientTypeKeys;
                if(!utility.isDuplicate(ingredientTypeKeys, indicatorEntry.name)) {
                  ingredientTypeKeys.push(indicatorEntry.name);
                }
              }
            }
          } else {
            for(var key in scope.indicatorObject) {
              var hasSetNewTrue = false;
              var indicatorEntry = scope.indicatorObject[key][index];
              if(key !== scope.productName && !hasSetNewTrue) {
                scope.indicatorObject[key][index].isSelected = true;
                //set scope.constructingStep.stepComposition ingredientTypeKeys
                //check for inclusion/presence here...
                var ingredientTypeKeys = scope.constructingStep.stepComposition[key].ingredientTypeKeys;
                if(!utility.isDuplicate(ingredientTypeKeys, indicatorEntry.name)) {
                  ingredientTypeKeys.push(indicatorEntry.name);
                }
                //just need one
                hasSetNewTrue = true;
              } else if(key === scope.productName) {
                //set scope.constructingStep.stepComposition
                //interplay with the ng-model? Don't want the current indicator array getting changed by this
                scope.indicatorObject[key][index].isSelected = false;
                var removeIndex = scope.constructingStep.stepComposition[key].ingredientTypeKeys.indexOf(indicatorEntry.name);
                if(removeIndex !== -1) {
                  scope.constructingStep.stepComposition[key].ingredientTypeKeys.splice(removeIndex, 1);
                }
              }
            }
          }
        };
      }
    };
  });
