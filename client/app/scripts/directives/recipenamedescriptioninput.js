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
                  for (var l = scope.dictionary[key].length - 1; l >= 0; l--) {
                    if(scope.isDescription && scope.textObj.description && scope.dictionary[key][l] === scope.textObj.description) {
                      scope.seasoningsIndicator[i] = true;
                      alreadyMarked = true;
                    } else if(scope.isName && scope.dictionary[key][l] === scope.textObj.name) {
                      scope.seasoningsIndicator[i] = true;
                      alreadyMarked = true;
                    }
                  }
                }
              }
            }
            if(!alreadyMarked) {
              for (var j = scope.modifiers.length - 1; j >= 0; j--) {
                if(scope.modifiers[j]._id === key) {
                  for (var m = scope.dictionary[key].length - 1; m >= 0; m--) {
                    if(scope.isDescription && scope.textObj.description && scope.dictionary[key][m] === scope.textObj.description) {
                      scope.modifiersIndicator[j] = true;
                      alreadyMarked = true;
                    } else if(scope.isName && scope.textObj.name && scope.dictionary[key][m] === scope.textObj.name) {
                      scope.modifiersIndicator[j] = true;
                      alreadyMarked = true;
                    }
                  }
                }
              }
            }
            if(!alreadyMarked) {
              for (var k = scope.adjectives.length - 1; k >= 0; k--) {
                if(scope.adjectives[k]._id === key) {
                  for (var n = scope.dictionary[key].length - 1; n >= 0; n--) {
                    if(scope.isDescription && scope.textObj.description && scope.dictionary[key][n] === scope.textObj.description) {
                      scope.adjectivesIndicator[k] = true;
                      alreadyMarked = true;
                    } else if(scope.isName && scope.textObj.name && scope.dictionary[key][n] === scope.textObj.name) {
                      scope.adjectivesIndicator[k] = true;
                      alreadyMarked = true;
                    }
                  }
                }
              }
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
              for (var i = scope.dictionary[key].length - 1; i >= 0; i--) {
                if(scope.dictionary[key][i] === scope.currentDescription) {
                  scope.dictionary[key][i] = scope.textObj.description;
                }
              }   
            }
          } else if(type === 'name') {
            for(var key in scope.dictionary) {
              for (var j = scope.dictionary[key].length - 1; j >= 0; j--) {
                if(scope.dictionary[key][j] === scope.currentName) {
                  scope.dictionary[key][j] = scope.textObj.name;
                }
              }
            }
          }
        };

        //are the manual setting of the indicators necessary?

        scope.toggleAdjective = function(adjective, index) {
          if(!scope.dictionary[adjective._id]) {
            //first time clicked case
            scope.dictionary[adjective._id] = [];
            if(scope.isName) {
              scope.dictionary[adjective._id].push(scope.textObj.name);
            } else if(scope.isDescription) {
              scope.dictionary[adjective._id].push(scope.textObj.description);
            }
          } else {
            //then has been clicked previously
            if(scope.isName) {
              if(scope.adjectivesIndicator[index]) {
                //is this right?
                scope.dictionary[adjective._id].push(scope.textObj.name);
              } else {
                var indexOfName = scope.dictionary[adjective._id].indexOf(scope.textObj.name);
                scope.dictionary[adjective._id].splice(indexOfName, 1);
                if(scope.dictionary[adjective._id].length === 0) {
                  delete scope.dictionary[adjective._id];
                }
              }
            } else if (scope.isDescription) {
              if(scope.adjectivesIndicator[index]) {
                scope.dictionary[adjective._id].push(scope.textObj.description);
              } else {
                var indexOfName = scope.dictionary[adjective._id].indexOf(scope.textObj.description);
                scope.dictionary[adjective._id].splice(indexOfName, 1);
                if(scope.dictionary[adjective._id].length === 0) {
                  delete scope.dictionary[adjective._id];
                }
              }
            }
          }
        };

        scope.toggleModifier = function(modifier, index) {
          if(!scope.dictionary[modifier._id]) {
            scope.dictionary[modifier._id] = [];
            if(scope.isName) {
              scope.dictionary[modifier._id].push(scope.textObj.name);
            } else if(scope.isDescription) {
              scope.dictionary[modifier._id].push(scope.textObj.description);
            }
          } else {
            if(scope.isName) {
              if(scope.modifiersIndicator[index]) {
                scope.dictionary[modifier._id].push(scope.textObj.name);
              } else {
                var indexOfName = scope.dictionary[modifier._id].indexOf(scope.textObj.name);
                scope.dictionary[modifier._id].splice(indexOfName, 1);
                if(scope.dictionary[modifier._id].length === 0) {
                  delete scope.dictionary[modifier._id];
                }
              }
            } else if (scope.isDescription) {
              if(scope.modifiersIndicator[index]) {
                scope.dictionary[modifier._id].push(scope.textObj.description);
              } else {
                var indexOfName = scope.dictionary[modifier._id].indexOf(scope.textObj.description);
                scope.dictionary[modifier._id].splice(indexOfName, 1);
                if(scope.dictionary[modifier._id].length === 0) {
                  delete scope.dictionary[modifier._id];
                }
              }
            }
          }
        };

        scope.toggleSeasoning = function(seasoning, index) {
          if(!scope.dictionary[seasoning._id]) {
            scope.dictionary[seasoning._id] = [];
            if(scope.isName) {
              scope.dictionary[seasoning._id].push(scope.textObj.name);
            } else if(scope.isDescription) {
              scope.dictionary[seasoning._id].push(scope.textObj.description);
            }
          } else {
            if(scope.isName) {
              if(scope.seasoningsIndicator[index]) {
                scope.dictionary[seasoning._id].push(scope.textObj.name);
              } else {
                var indexOfName = scope.dictionary[seasoning._id].indexOf(scope.textObj.name);
                scope.dictionary[seasoning._id].splice(indexOfName, 1);
                if(scope.dictionary[seasoning._id].length === 0) {
                  delete scope.dictionary[seasoning._id];
                }
              }
            } else if (scope.isDescription) {
              if(scope.seasoningsIndicator[index]) {
                scope.dictionary[seasoning._id].push(scope.textObj.description);
              } else {
                var indexOfName = scope.dictionary[seasoning._id].indexOf(scope.textObj.description);
                scope.dictionary[seasoning._id].splice(indexOfName, 1);
                if(scope.dictionary[seasoning._id].length === 0) {
                  delete scope.dictionary[seasoning._id];
                }
              }
            }
          }
        };
      }
    };
  });
