'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.lessonService
 * @description
 * # lessonService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('lessonService', function (Restangular, RestangularProductionService) {
    
    var baseLessons = Restangular.all('lessons');
    var baseProductionLessons = RestangularProductionService.all('lessons');

    return {
      addNewLesson: function(newLesson, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionLessons.post({lesson: newLesson}));
        }
        if(useDev) {
          promises.push(baseLessons.post({lesson: newLesson}));
        }
        return Promise.all(promises);
      },
      getLessonsForChapterConstruction: function(useProd) {
        if(useProd) {
          return baseProductionLessons.customGET('/getLessonsForChapterConstruction');
        } else {
          return baseLessons.customGET('/getLessonsForChapterConstruction');
        }
      },
      getAllLessons: function(useProd) {
        if(useProd) {
          return baseProductionLessons.customGET('/');
        } else {
          return baseLessons.customGET('/');
        }
      },
      updateLesson: function(lesson, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionLessons.customPUT({lesson: lesson}, '/' + lesson._id));
        } 
        if(useDev) {
          promises.push(baseLessons.customPUT({lesson: lesson}, '/' + lesson._id));
        }
        return Promise.all(promises);
      },
      deleteLesson: function(lesson, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionLessons.customDELETE('/' + lesson._id));
        }
        if(useDev) {
          promises.push(baseLessons.customDELETE('/' + lesson._id));
        }
        return Promise.all(promises);
      }
    };
  });
