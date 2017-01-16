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
        }
        if(scope.type === 'description') {
          scope.isDescription = true;
        }

        if(scope.preloadIndicators) {
          //cycle through dictionary keys; if key touches off any one of the things,
          //then mark appropriate indicator
          for(var key in scope.dictionary) {
            var alreadyMarked = false;
            if(!alreadyMarked) {
              for (var i = scope.seasonings.length - 1; i >= 0; i--) {
                if(scope.seasonings[i]._id === key) {
                  scope.seasoningsIndicator[i] = true;
                  alreadyMarked = true;
                }
              }
            }
            if(!alreadyMarked) {
              for (var j = scope.modifiers.length - 1; j >= 0; j--) {
                if(scope.modifiers[j]._id === key) {
                  scope.modifiersIndicator[j] = true;
                  alreadyMarked = true;
                }
              }
            }
            if(!alreadyMarked) {
              for (var k = scope.adjectives.length - 1; k >= 0; k--) {
                if(scope.adjectives[k]._id === key) {
                  scope.adjectivesIndicator[k] = true;
                  alreadyMarked = true;
                }
              }
            }
          }
        }

        //will need to have a script run on the change of values to the description and names for the input dictionary...
        scope.logText = function(type) {
          if(type === 'description') {
            scope.currentName = scope.textObj.description;
          } else if(type === 'name') {
            scope.currentDescription = scope.textObj.name;
          }
        };

        scope.commuteTextChanges = function(type) {
          if(type === 'description') {
            for(var key in scope.dictionary) {
              if(scope.dictionary[key] === scope.currentDescription) {
                scope.dictionary[key] = scope.textObj.description;
              }
            }
          } else if(type === 'name') {
            for(var key in scope.dictionary) {
              if(scope.dictionary[key] === scope.currentName) {
                scope.dictionary[key] = scope.textObj.name;
              }
            }
          }
        };

        //are the manual setting of the indicators necessary?

        scope.toggleAdjective = function(adjective, index) {
          if(!scope.dictionary[adjective._id]) {
            scope.dictionary[adjective._id] = [];
            if(scope.isName) {
              scope.adjectivesIndicator[index] = true;
              scope.dictionary[adjective._id].push(scope.textObj.name);
            } else if(scope.isDescription) {
              scope.adjectivesIndicator[index] = true;
              scope.dictionary[adjective._id].push(scope.textObj.description);
            }
          } else {
            if(scope.isName) {
              if(!scope.adjectivesIndicator[index]) {
                scope.adjectivesIndicator[index] = true;
                scope.dictionary[adjective._id].push(scope.textObj.name);
              } else {
                scope.adjectivesIndicator[index] = false;
                var indexOfName = scope.dictionary[adjective._id].indexOf(scope.textObj.name);
                scope.dictionary[adjective._id].splice(indexOfName, 1);
                if(scope.dictionary[adjective._id].length === 0) {
                  scope.dictionary[adjective._id] = undefined;
                }
              }
            } else if (scope.isDescription) {
              if(!scope.adjectivesIndicator[index]) {
                scope.adjectivesIndicator[index] = true;
                scope.dictionary[adjective._id].push(scope.textObj.description);
              } else {
                scope.adjectivesIndicator[index] = false;
                var indexOfName = scope.dictionary[adjective._id].indexOf(scope.textObj.description);
                scope.dictionary[adjective._id].splice(indexOfName, 1);
                if(scope.dictionary[adjective._id].length === 0) {
                  scope.dictionary[adjective._id] = undefined;
                }
              }
            }
          }
        };

        scope.toggleModifier = function(modifier, index) {
          if(!scope.dictionary[modifier._id]) {
            scope.dictionary[modifier._id] = [];
            if(scope.isName) {
              scope.modifiersIndicator[index] = true;
              scope.dictionary[modifier._id].push(scope.textObj.name);
            } else if(scope.isDescription) {
              scope.modifiersIndicator[index] = true;
              scope.dictionary[modifier._id].push(scope.textObj.description);
            }
          } else {
            if(scope.isName) {
              if(!scope.modifiersIndicator[index]) {
                scope.modifiersIndicator[index] = true;
                scope.dictionary[modifier._id].push(scope.textObj.name);
              } else {
                scope.modifiersIndicator[index] = false;
                var indexOfName = scope.dictionary[modifier._id].indexOf(scope.textObj.name);
                scope.dictionary[modifier._id].splice(indexOfName, 1);
                if(scope.dictionary[modifier._id].length === 0) {
                  scope.dictionary[modifier._id] = undefined;
                }
              }
            } else if (scope.isDescription) {
              if(!scope.modifiersIndicator[index]) {
                scope.modifiersIndicator[index] = true;
                scope.dictionary[modifier._id].push(scope.textObj.description);
              } else {
                scope.modifiersIndicator[index] = false;
                var indexOfName = scope.dictionary[modifier._id].indexOf(scope.textObj.description);
                scope.dictionary[modifier._id].splice(indexOfName, 1);
                if(scope.dictionary[modifier._id].length === 0) {
                  scope.dictionary[modifier._id] = undefined;
                }
              }
            }
          }
        };

        scope.toggleSeasoning = function(seasoning, index) {
          if(!scope.dictionary[seasoning._id]) {
            scope.dictionary[seasoning._id] = [];
            if(scope.isName) {
              scope.seasoningsIndicator[index] = true;
              scope.dictionary[seasoning._id].push(scope.textObj.name);
            } else if(scope.isDescription) {
              scope.seasoningsIndicator[index] = true;
              scope.dictionary[seasoning._id].push(scope.textObj.description);
            }
          } else {
            if(scope.isName) {
              if(!scope.seasoningsIndicator[index]) {
                scope.seasoningsIndicator[index] = true;
                scope.dictionary[seasoning._id].push(scope.textObj.name);
              } else {
                scope.seasoningsIndicator[index] = false;
                var indexOfName = scope.dictionary[seasoning._id].indexOf(scope.textObj.name);
                scope.dictionary[seasoning._id].splice(indexOfName, 1);
                if(scope.dictionary[seasoning._id].length === 0) {
                  scope.dictionary[seasoning._id] = undefined;
                }
              }
            } else if (scope.isDescription) {
              if(!scope.seasoningsIndicator[index]) {
                scope.seasoningsIndicator[index] = true;
                scope.dictionary[seasoning._id].push(scope.textObj.description);
              } else {
                scope.seasoningsIndicator[index] = false;
                var indexOfName = scope.dictionary[seasoning._id].indexOf(scope.textObj.description);
                scope.dictionary[seasoning._id].splice(indexOfName, 1);
                if(scope.dictionary[seasoning._id].length === 0) {
                  scope.dictionary[seasoning._id] = undefined;
                }
              }
            }
          }
        };
      }
    };
  });
