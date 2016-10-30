'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.chapterService
 * @description
 * # chapterService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('chapterService', function (Restangular, RestangularProductionService) {
    var baseChapters = Restangular.all('chapters');
    var baseProductionChapters = RestangularProductionService.all('chapters');

    return {
      addNewChapter: function(newChapter, useProd, useDev) {
        var promises = [];
        if(useDev) {
          promises.push(baseChapters.post({chapter: newChapter}));
        }
        if(useProd) {
          promises.push(baseProductionChapters.post({chapter: newChapter}));
        }
        return Promise.all(promises);
      },
      getAllChapters: function(useProd) {
        if(useProd) {
          return baseProductionChapters.customGET('/');
        } else {
          return baseChapters.customGET('/');
        }
      },
      updateChapter: function(chapter, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionChapters.customPUT({chapter: chapter}, '/' + chapter._id));
        }
        if(useDev) {
          promises.push(baseChapters.customPUT({chapter: chapter}, '/' + chapter._id));
        }
        return Promise.all(promises);
      },
      deleteChapter: function(chapter, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionChapters.customDELETE('/' + chapter._id));
        }
        if(useDev) {
          promises.push(baseChapters.customDELETE('/' + chapter._id));
        }
        return Promise.all(promises);
      }
    };
  });
