'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:editContentSection
 * @description
 * # editContentSection
 */
angular.module('SkillitAdminApp')
  .directive('editContentSection', function () {
    return {
      templateUrl: 'views/editcontentsection.html',
      restrict: 'E',
      scope: {
        section: '=',
        tips: '=',
        glossaryEntries: '=glossaries',
        howToShopEntries: '=howtos',
        trainingVideos: '=trainings'
      },
      link: function (scope, element, attrs) {
        scope.contentTypes = ['text', 'picture', 'video'];

        //initialize contentPieceIndicators for view
        scope.contentPieceIndicatorArray = new Array(scope.section.contentArray.length);
        scope.contentPieceIndicatorArray.fill(true);

        //initialize textChunkIndicators for view
        scope.textChunkForPieceIndicator = new Array(scope.section.contentArray.length);
        for (var i = 0; i < scope.section.contentArray.length; i++) {
          if(scope.section.contentArray[i].type === 'text') {
            scope.textChunkForPieceIndicator[i] = new Array(scope.section.contentArray[i].textChunks.length);
            scope.textChunkForPieceIndicator[i].fill(true);
          } else {
            //in case a given piece is changed to 'text' type
            scope.textChunkForPieceIndicator[i] = [];
          }
        }

        scope.contentPieceMinimized = function(index) {
          return scope.contentPieceIndicatorArray[index];
        };

        scope.isMinimizedTextChunk = function(pieceIndex, chunkIndex) {
          return scope.textChunkForPieceIndicator[pieceIndex][chunkIndex];
        };

        scope.removeTextChunk = function(pieceIndex, chunkIndex) {
          scope.section.contentArray[pieceIndex].textChunks.splice(chunkIndex, 1);
          scope.textChunkForPieceIndicator[pieceIndex].splice(chunkIndex, 1);
        };

        scope.toggleTextChunk = function(pieceIndex, chunkIndex) {
          scope.textChunkForPieceIndicator[pieceIndex][chunkIndex] = ! scope.textChunkForPieceIndicator[pieceIndex][chunkIndex];
        };

        scope.addTextChunk = function(pieceIndex) {
          //check if contentArray[pieceIndex] has a textChunks array
          if(!scope.section.contentArray[pieceIndex].textChunks) {
            scope.section.contentArray[pieceIndex].textChunks = [];
          }
          //empty text chunk
          scope.section.contentArray[pieceIndex].textChunks.push({});
          //make visible for immediate editing
          scope.textChunkForPieceIndicator[pieceIndex].push(false);
        };

        scope.getToggleTextChunkText = function(pieceIndex, chunkIndex) {
          if(scope.textChunkForPieceIndicator[pieceIndex][chunkIndex]) {
            return 'Expand';
          } else {
            return 'Minimize';
          }
        };

        scope.removeContentPiece = function(pieceIndex) {
          scope.section.contentArray.splice(pieceIndex, 1);
          scope.contentPieceIndicatorArray.splice(pieceIndex);
          scope.textChunkForPieceIndicator.splice(pieceIndex);
        };

        scope.toggleContentPiece = function(pieceIndex) {
          scope.contentPieceIndicatorArray[pieceIndex] = !scope.contentPieceIndicatorArray[pieceIndex];
        };

        scope.getContentPieceToggleText = function(pieceIndex) {
          if(scope.contentPieceIndicatorArray[pieceIndex]) {
            return 'Expand';
          } else {
            return 'Minimize';
          }
        };

        scope.addContentPiece = function() {
          scope.section.contentArray.push({});
          //make initially visible
          scope.contentPieceIndicatorArray.push(false);
          scope.textChunkForPieceIndicator.push([]);
        };
      }
    };
  });
