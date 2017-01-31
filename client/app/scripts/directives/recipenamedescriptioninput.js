'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:recipeNameDescriptionInput
 * @description
 * # recipeNameDescriptionInput
 */
angular.module('SkillitAdminApp')
  .directive('recipeNameDescriptionInput', function () {
    return {
      templateUrl: 'views/recipenamedescriptioninput.html',
      restrict: 'E',
      transclude: false,
      scope: {
        seasonings: '=',
        adjectives: '=',
        modifiers: '=',
        dictionary: '=',
        textObj: '=',
        type: '=',
        preloadIndicators: '='
      },
      link: function (scope, element, attrs) {
        scope.seasoningsIndicator = new Array(scope.seasonings.length).fill(false);
        scope.modifiersIndicator = new Array(scope.modifiers.length).fill(false);
        scope.adjectivesIndicator = new Array(scope.adjectives.length).fill(false);

        if(scope.type === 'name') {
          scope.isName = true;
          scope.isDescription = false;
        }
        if(scope.type === 'description') {
          scope.isDescription = true;
          scope.isName = false;
        }

        function fillInIsh(prefixObj, isName, indicator, textObj) {
          for (var i = prefixObj.textArr.length - 1; i >= 0; i--) {
            if(isName && textObj.name && prefixObj.textArr[i] === textObj.name) {
              indicator[i] = true;
            } else if(!isName && textObj.description && textObj.description === prefixObj.textArr[i]){
              indicator[i] = true;
            }
          }
        }

        if(scope.preloadIndicators) {
          //cycle through dictionary keys; if key touches off any one of the things,
          //then mark appropriate indicator
          for(var key in scope.dictionary) {
            switch(scope.dictionary[key].type) {
              case 'adjective':
                fillInIsh(scope.dictionary[key], scope.isName, scope.adjectivesIndicator);
                break;
              case 'modifier':
                fillInIsh(scope.dictionary[key], scope.isName, scope.modifiersIndicator);
                break;
              case 'seasoning':
                fillInIsh(scope.dictionary[key], scope.isName, scope.seasoningsIndicator);
                break;
              default:
                break;
            }
          }
        }

        //will need to have a script run on the change of values to the description and names for the input dictionary...
        scope.logText = function(type) {
          if(type === 'description') {
            scope.currentDescription = scope.textObj.description;
          } else if(type === 'name') {
            scope.currentName = scope.textObj.name;
          }
        };

        scope.commuteTextChanges = function(type) {
          if(type === 'description') {
            for(var key in scope.dictionary) {
              for (var i = scope.dictionary[key].textArr.length - 1; i >= 0; i--) {
                if(scope.dictionary[key].textArr[i] === scope.currentDescription) {
                  scope.dictionary[key].textArr[i] = scope.textObj.description;
                }
              }   
            }
          } else if(type === 'name') {
            for(var key in scope.dictionary) {
              for (var j = scope.dictionary[key].length - 1; j >= 0; j--) {
                if(scope.dictionary[key].textArr[j] === scope.currentName) {
                  scope.dictionary[key].textArr[j] = scope.textObj.name;
                }
              }
            }
          }
        };

        //are the manual setting of the indicators necessary?

        scope.toggleAdjective = function(adjective, index) {
          if(!scope.dictionary[adjective._id]) {
            //first time clicked case
            scope.dictionary[adjective._id] = {
              textArr: [],
              type: 'adjective'
            };
            if(scope.isName) {
              scope.dictionary[adjective._id].textArr.push(scope.textObj.name);
            } else if(scope.isDescription) {
              scope.dictionary[adjective._id].textArr.push(scope.textObj.description);
            }
          } else {
            //then has been clicked previously
            if(scope.isName) {
              if(scope.adjectivesIndicator[index]) {
                //is this right?
                scope.dictionary[adjective._id].textArr.push(scope.textObj.name);
              } else {
                var indexOfName = scope.dictionary[adjective._id].textArr.indexOf(scope.textObj.name);
                scope.dictionary[adjective._id].textArr.splice(indexOfName, 1);
                if(scope.dictionary[adjective._id].textArr.length === 0) {
                  delete scope.dictionary[adjective._id];
                }
              }
            } else if (scope.isDescription) {
              if(scope.adjectivesIndicator[index]) {
                scope.dictionary[adjective._id].textArr.push(scope.textObj.description);
              } else {
                var indexOfName = scope.dictionary[adjective._id].textArr.indexOf(scope.textObj.description);
                scope.dictionary[adjective._id].textArr.splice(indexOfName, 1);
                if(scope.dictionary[adjective._id].textArr.length === 0) {
                  delete scope.dictionary[adjective._id].textArr;
                }
              }
            }
          }
        };

        scope.toggleModifier = function(modifier, index) {
          if(!scope.dictionary[modifier._id]) {
            scope.dictionary[modifier._id] = {
              textArr: [],
              type: 'modifier'
            };
            if(scope.isName) {
              scope.dictionary[modifier._id].textArr.push(scope.textObj.name);
            } else if(scope.isDescription) {
              scope.dictionary[modifier._id].textArr.push(scope.textObj.description);
            }
          } else {
            if(scope.isName) {
              if(scope.modifiersIndicator[index]) {
                scope.dictionary[modifier._id].textArr.push(scope.textObj.name);
              } else {
                var indexOfName = scope.dictionary[modifier._id].textArr.indexOf(scope.textObj.name);
                scope.dictionary[modifier._id].textArr.splice(indexOfName, 1);
                if(scope.dictionary[modifier._id].textArr.length === 0) {
                  delete scope.dictionary[modifier._id];
                }
              }
            } else if (scope.isDescription) {
              if(scope.modifiersIndicator[index]) {
                scope.dictionary[modifier._id].textArr.push(scope.textObj.description);
              } else {
                var indexOfName = scope.dictionary[modifier._id].textArr.indexOf(scope.textObj.description);
                scope.dictionary[modifier._id].textArr.splice(indexOfName, 1);
                if(scope.dictionary[modifier._id].textArr.length === 0) {
                  delete scope.dictionary[modifier._id];
                }
              }
            }
          }
        };

        scope.toggleSeasoning = function(seasoning, index) {
          if(!scope.dictionary[seasoning._id]) {
            scope.dictionary[seasoning._id] = {
              textArr: [],
              type: 'seasoning'
            };
            if(scope.isName) {
              scope.dictionary[seasoning._id].textArr.push(scope.textObj.name);
            } else if(scope.isDescription) {
              scope.dictionary[seasoning._id].textArr.push(scope.textObj.description);
            }
          } else {
            if(scope.isName) {
              if(scope.seasoningsIndicator[index]) {
                scope.dictionary[seasoning._id].textArr.push(scope.textObj.name);
              } else {
                var indexOfName = scope.dictionary[seasoning._id].textArr.indexOf(scope.textObj.name);
                scope.dictionary[seasoning._id].textArr.splice(indexOfName, 1);
                if(scope.dictionary[seasoning._id].textArr.length === 0) {
                  delete scope.dictionary[seasoning._id];
                }
              }
            } else if (scope.isDescription) {
              if(scope.seasoningsIndicator[index]) {
                scope.dictionary[seasoning._id].textArr.push(scope.textObj.description);
              } else {
                var indexOfName = scope.dictionary[seasoning._id].textArr.indexOf(scope.textObj.description);
                scope.dictionary[seasoning._id].textArr.splice(indexOfName, 1);
                if(scope.dictionary[seasoning._id].textArr.length === 0) {
                  delete scope.dictionary[seasoning._id];
                }
              }
            }
          }
        };
      }
    };
  });
