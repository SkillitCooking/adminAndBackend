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
      },
      getAllChapters: function() {
        return baseChapters.customGET('/');
      },
      updateChapter: function(chapter) {
        return baseChapters.customPUT({chapter: chapter}, '/' + chapter._id);
      },
      deleteChapter: function(chapter) {
        return baseChapters.customDELETE('/' + chapter._id);
      }
    };
  });
