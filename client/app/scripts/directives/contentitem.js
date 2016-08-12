'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:contentitem
 * @description
 * # contentitem
 */
angular.module('SkillitAdminApp')
  .directive('contentitem', function () {
    return {
      templateUrl: 'views/contentitem.html',
      scope: {
        item: '='
      },
      restrict: 'E',
      link: function (scope, element, attrs) {
        //When testing, make sure that the ordering works out alright...
        //may be reversed
        scope.getText = function() {
          var count = 0;
          var textOutput = "";
          for (var i = scope.item.textChunks.length - 1; i >= 0; i--) {
            textOutput += scope.item.textChunks[i].text;
            if(scope.item.textChunks[i].linkedItem) {
                textOutput += '[' + count + ']';
            }
            if(i !== 0) {
              textOutput += ' ';
            }
            count++;
          }
          return textOutput;
        };

        scope.getFootnotes = function() {
          if(!scope.footnotes) {
            scope.footnotes = [];
            for (var i = scope.item.textChunks.length - 1; i >= 0; i--) {
              if(scope.item.textChunks[i].linkedItem) {
                scope.footnotes.push({
                  title: scope.item.textChunks[i].linkedItem.title,
                  type: scope.item.textChunks[i].linkedItem.itemType,
                  id: scope.item.textChunks[i].linkedItem._id
                });
              }
            }
          }
          return scope.footnotes;
        };
      }
    };
  });
