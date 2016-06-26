'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.trainingVideosService
 * @description
 * # trainingVideosService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('trainingVideosService', function (Restangular) {
    
    var baseTrainingVideos = Restangular.all('trainingVideos');

    return {
      getAllTrainingVideos: function() {
        return baseTrainingVideos.customGET('/');
      },
      addNewTrainingVideo: function(newVideo) {
        return baseTrainingVideos.post(newVideo);
      }
    };
  });
