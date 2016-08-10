'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:articlepreview
 * @description
 * # articlepreview
 */
angular.module('SkillitAdminApp')
  .directive('articlepreview', function () {
    return {
      templateUrl: 'views/articlepreview.html',
      scope: true,
      transclude: false,
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.getText = function(item) {
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

        scope.getFootnotes = function(item) {
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
