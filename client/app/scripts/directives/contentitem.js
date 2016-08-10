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
          for (var i = item.textChunks.length - 1; i >= 0; i--) {
            textOutput += item.textChunks[i].text;
            if(item.textChunks[i].linkedItem) {
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
          var footnotes = [];
          for (var i = item.textChunks.length - 1; i >= 0; i--) {
            footnotes.push({
              title: item.textChunks[i].linkedItem.title,
              type: item.textChunks[i].linkedItem.itemType,
              id: item.textChunks[i].linkedItem._id
            });
          }
          return footnotes;
        };
      }
    };
  });
