'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:contentsection
 * @description
 * # contentsection
 */
angular.module('SkillitAdminApp')
  .directive('contentsection', function () {
    return {
      templateUrl: 'views/contentsection.html',
      scope: true,
      transclude: false,
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.contentTypes = ['text', 'picture', 'video'];
        scope.textChunks = [];
        scope.textChunksIndicator = [];
        scope.textChunk = {};
        scope.contentIndicatorArray = [];

        scope.toggleContentPiece = function(index) {
          scope.contentIndicatorArray[index] = !scope.contentIndicatorArray[index];
        };

        scope.removeContent = function(index) {
          scope.contentIndicatorArray.splice(index, 1);
          scope.contentSection.contentArray.splice(index, 1);
        };

        scope.toggleTextChunk = function(index) {
          scope.textChunksIndicator[index] = !scope.textChunksIndicator[index];
        };

        scope.removeTextChunk = function(index) {
          scope.textChunks.splice(index, 1);
          scope.textChunksIndicator.splice(index, 1);
        };

        scope.addTextChunk = function() {
          scope.textChunks.push(scope.textChunk);
          scope.textChunksIndicator.push(false);
          scope.textChunk = angular.copy({});
        };

        scope.resetContentProperties = function() {
          scope.textChunks = angular.copy([]);
          scope.textChunksIndicator = angular.copy([]);
          scope.pictureURL = "";
          scope.pictureCaption = "";
          scope.videoURL = "";
          scope.videoCaption = "";
        };

        scope.addContent = function() {
          if(!scope.contentSection.contentArray) {
            scope.contentSection.contentArray = [];
          }
          switch(scope.contentType) {
            case 'text':
              scope.contentSection.contentArray.push({
                type: 'text',
                textChunks: scope.textChunks
              });
              scope.contentIndicatorArray.push(false);
              scope.resetContentProperties();
              break;
            case 'picture':
              scope.contentSection.contentArray.push({
                type: 'picture',
                url: scope.pictureURL,
                caption: scope.pictureCaption
              });
              scope.contentIndicatorArray.push(false);
              scope.resetContentProperties();
              break;
            case 'video':
              scope.contentSection.contentArray.push({
                type: 'video',
                url: scope.videoURL,
                caption: scope.videoCaption
              });
              scope.contentIndicatorArray.push(false);
              scope.resetContentProperties();
              break;
            default:
              break;
          }
        };
      }
    };
  });
