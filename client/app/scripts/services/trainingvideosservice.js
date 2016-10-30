'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.trainingVideosService
 * @description
 * # trainingVideosService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('trainingVideosService', function (Restangular, RestangularProductionService) {
    
    var baseTrainingVideos = Restangular.all('trainingVideos');
    var baseProductionTrainingVideos = RestangularProductionService.all('trainingVideos');

    return {
      getAllTrainingVideos: function(useProd) {
        if(useProd) {
          return baseProductionTrainingVideos.customGET('/');
        } else {
          return baseTrainingVideos.customGET('/');
        }
      },
      addNewTrainingVideo: function(newVideo, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionTrainingVideos.post(newVideo));
        }
        if(useDev) {
          promises.push(baseTrainingVideos.post(newVideo));
        }
        return Promise.all(promises);
      },
      updateTrainingVideo: function(video, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionTrainingVideos.customPUT({trainingVideo: video}, '/' + video._id));
        }
        if(useDev) {
          promises.push(baseTrainingVideos.customPUT({trainingVideo: video}, '/' + video._id));
        }
        return Promise.all(promises);
      },
      deleteTrainingVideo: function(video, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionTrainingVideos.customDELETE('/' + video._id));
        }
        if(useDev) {
          baseTrainingVideos.customDELETE('/' + video._id);
        }
        return Promise.all(promises);
      }
    };
  });
