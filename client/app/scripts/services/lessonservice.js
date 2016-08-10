'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.lessonService
 * @description
 * # lessonService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('lessonService', function (Restangular) {
    
    var baseLessons = Restangular.all('lessons');

    return {
      addNewLesson: function(newLesson) {
        return baseLessons.post({lesson: newLesson});
      },
      getLessonsForChapterConstruction: function() {
        return baseLessons.customGET('/getLessonsForChapterConstruction');
      }
    };
  });
