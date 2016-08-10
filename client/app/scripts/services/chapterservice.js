'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.chapterService
 * @description
 * # chapterService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('chapterService', function (Restangular) {
    var baseChapters = Restangular.all('chapters');

    return {
      addNewChapter: function(newChapter) {
        return baseChapters.post({chapter: newChapter});
      }
    };
  });
