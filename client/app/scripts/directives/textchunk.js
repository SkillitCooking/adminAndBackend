'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:textchunk
 * @description
 * # textchunk
 */
angular.module('SkillitAdminApp')
  .directive('textchunk', function () {
    return {
      templateUrl: 'views/textchunk.html',
      scope: true,
      transclude: false,
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.itemTypes = ['None', 'tip', 'glossary', 'howToShop', 'trainingVideo'];
        //Expect parent scope to have tips, glossaryEntries, howToShopEntries, TrainingVideos all loaded
        scope.getTitle = function(item) {
          switch(scope.textChunk.itemType) {
            case 'tip':
            case 'glossary':
            case 'howToShop':
            case 'trainingVideo':
              return item.title;

            default:
              return '';
          }
        };

        scope.getItemsForType = function() {
          switch(scope.textChunk.itemType) {
            case 'tip':
              return scope.tips;
            case 'glossary':
              return scope.glossaryEntries;
            case 'howToShop':
              return scope.howToShopEntries;
            case 'trainingVideo':
              return scope.trainingVideos;
            default:
              return [];
          }
        };
      }
    };
  });
