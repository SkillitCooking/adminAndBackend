'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:removeStepProducts
 * @description
 * # removeStepProducts
 */
angular.module('SkillitAdminApp')
  .directive('removeStepProducts', function (utility) {
    return {
      templateUrl: 'views/removestepproducts.html',
      restrict: 'E',
      scope: {
        constructingStep: '=',
        composingTypes: '=',
        inputDish: '='
      },
      link: function (scope, element, attrs) {
        //need to initialize indicators
        function isInCompositionIngredientKeys(composition, indicatorObject) {
          var index = composition.ingredientTypeKeys.findIndex(function(typeKey) {
            return typeKey === indicatorObject.name;
          });
          return index !== -1;
        }

        if(!scope.indicators) {
          scope.indicators = {};
        }
        if(scope.constructingStep.stepComposition && scope.composingTypes) {
          //initialize dishProductName
          for(var prodName in scope.constructingStep.stepComposition) {
            var composition = scope.constructingStep.stepComposition[prodName];
            if(composition.type === 'dish') {
              scope.dishProductName = prodName;
            }
            //initialize selection of composingTypes
            for (var r = scope.composingTypes.length - 1; r >= 0; r--) {
              if(composition.type === 'removeIngredientType') {
                for (var s = composition.ingredientTypeKeys.length - 1; s >= 0; s--) {
                  var ingredientKey = composition.ingredientTypeKeys[s];
                  if(ingredientKey === scope.composingTypes[r].typeName) {
                    scope.composingTypes[r].isSelected = true;
                  }
                }
              }
            }
          }
          //initialize indicators
          for(var prodName in scope.constructingStep.stepComposition) {
            var composition = scope.constructingStep.stepComposition[prodName];
            scope.indicators[prodName] = scope.composingTypes.filter(function(element) {
              return element.isSelected;
            }).map(function(element) {
              return {
                name: element.typeName,
                isSelected: false,
                insertionRanking: element.insertionRanking
              };
            });
            utility.propertySort(scope.indicators[prodName], 'insertionRanking');
            for (var i = scope.indicators[prodName].length - 1; i >= 0; i--) {
              scope.indicators[prodName][i].isSelected = isInCompositionIngredientKeys(composition, scope.indicators[prodName][i]);
            }
          }
          //initialize productNames
          if((!scope.constructingStep.productNames || scope.constructingStep.productNames.length === 0) && scope.constructingStep.productKeys) {
            scope.constructingStep.productNames = [];
            console.log('constructingStep', angular.copy(scope.constructingStep));
            for (var z = scope.constructingStep.productKeys.length - 1; z >= 0; z--) {
              var key = scope.constructingStep.productKeys[z];
              scope.constructingStep.productNames.push({
                name: key,
                type: scope.constructingStep.stepComposition[key].type
              });
            }
          }
        }

        scope.logDishProductName = function() {
          //if constructingStep.productNames empty, then need to add and initialize
          scope.currentDishProductName = scope.dishProductName;
        };


        function getIngredientKeys(getSelected) {
          return scope.composingTypes.filter(function(type) {
            if(getSelected) {
              return type.isSelected;
            } else {
              return !type.isSelected;
            }
          }).map(function(type) {
            return type.typeName;
          });
        }

        scope.commuteDishProductNameChanges = function() {
          //what if empty string given? then probably just want to keep the previous name...
          if(!scope.dishProductName) {
            scope.dishProductName = scope.currentDishProductName;
          } else {
            //check if constructingStep.productNames
            if(scope.constructingStep.productNames.length === 0) {
              //then initialize productNames
              scope.constructingStep.productNames.push({
                name: scope.dishProductName,
                type: "dish"
              });
              //add dishProduct to constructingStep.stepComposition
              if(!scope.constructingStep.stepComposition) {
                scope.constructingStep.stepComposition = {};
              }
              //get all ingredientKeys
              var ingredientKeys = getIngredientKeys(false);
              scope.constructingStep.stepComposition[scope.dishProductName] = {
                type: "dish",
                dish: scope.inputDish,
                ingredientTypeKeys: ingredientKeys
              };
            } else {
              //find previous name in constructingStep.stepComposition + change
              var compositionCopy = angular.copy(scope.constructingStep.stepComposition[scope.currentDishProductName]);
              scope.constructingStep.stepComposition[scope.dishProductName] = compositionCopy;
              delete scope.constructingStep.stepComposition[scope.currentDishProductName];
              //find previous name in constructingStep.productNames + change
              for (var i = scope.constructingStep.productNames.length - 1; i >= 0; i--) {
                if(scope.constructingStep.productNames[i].type === 'dish') {
                  scope.constructingStep.productNames[i].name = scope.dishProductName;
                }
              }
            }
          }
        };

        function indicatorCmpFn(element) {
          return element.insertionRanking;
        }

        scope.commuteTypeSelection = function(index) {
          if(scope.composingTypes[index].isSelected) {
            //then add to removedType indicators
            var setOneToTrue = false;
            for(var key in scope.indicators) {
              var insertionIndex = _.sortedIndexBy(scope.indicators[key], scope.composingTypes[index], indicatorCmpFn);
              console.log('insertionIndex', insertionIndex);
              var objectToInsert;
              if(!setOneToTrue) {
                //instead of push, insert
                objectToInsert = {
                  name: scope.composingTypes[index].typeName,
                  isSelected: true,
                  insertionRanking: scope.composingTypes[index].insertionRanking
                };
                setOneToTrue = true;
              } else {
                //instead of push insert
                objectToInsert = {
                  name: scope.composingTypes[index].typeName,
                  isSelected: false,
                  insertionRanking: scope.composingTypes[index].insertionRanking
                };
              }
              scope.indicators[key].splice(insertionIndex, 0, objectToInsert);
            }
          } else {
            //find index in each indicator where name matches and take out
            var hasTypeName = function(element) {
              return element.name === scope.composingTypes[index].typeName;
            };
            for(var key in scope.indicators) {
              //logs here
              var removeIndex = scope.indicators[key].findIndex(hasTypeName);
              if(removeIndex !== -1) {
                scope.indicators[key].splice(removeIndex, 1);
              }
            }
          }
          //amend dishProduct ingredientKeys
          scope.constructingStep.stepComposition[scope.dishProductName].ingredientTypeKeys = getIngredientKeys(false);
        };

        scope.removeStepProduct = function(name, index) {
          name = name.name;
          var indicatorToBeRemoved = scope.indicators[name];
          var selectedNames = [];
          for (var i = indicatorToBeRemoved.length - 1; i >= 0; i--) {
            if(indicatorToBeRemoved[i].isSelected) {
              selectedNames.push(indicatorToBeRemoved[i].name);
            }
          }
          delete scope.indicators[name];
          delete scope.constructingStep.stepComposition[name];
          scope.constructingStep.productNames.splice(index, 1);
          for(var key in scope.indicators) {
            for (var i = scope.indicators[key].length - 1; i >= 0; i--) {
              //if name is in selectedNames, set isSelected to true
              if(selectedNames.indexOf(scope.indicators[key][i].name) !== -1) {
                scope.indicators[key][i].isSelected = true;
              }
            }
            //only need one...
            break;
          }
        };

        function getNewIndicator() {
          var shouldBeSelected = false;
          if(Object.keys(scope.indicators).length === 0) {
            shouldBeSelected = true;
          }
          return scope.composingTypes.filter(function(element) {
            return element.isSelected;
          }).map(function(element) {
            return {
              name: element.typeName,
              isSelected: shouldBeSelected,
              insertionRanking: element.insertionRanking
            };
          });
          //if only one key in indicators, set to true
        }

        scope.addStepProduct = function() {
          scope.constructingStep.productNames.push({
            name: 'NEW',
            type: 'removeIngredientType'
          });
          //indicators need to match the cardinality of the types selected for removal
          scope.indicators.NEW = getNewIndicator();
          //initialize below if first one being added...
          var ingredientTypeKeys = scope.indicators.NEW.filter(function(element) {
            return element.isSelected;
          }).map(function(element) {
            return element.name;
          });
          scope.constructingStep.stepComposition.NEW = {
            type: 'removeIngredientType',
            ingredientTypeKeys: ingredientTypeKeys
          };
        };

        scope.noDishProductName = function() {
          //could also test via length of constructingStep.productNames...
          return !scope.dishProductName;
        };
      }
    };
  });