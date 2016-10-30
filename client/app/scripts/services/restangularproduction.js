'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.restangularProduction
 * @description
 * # restangularProduction
 * Factory in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('RestangularProductionService', function (Restangular) {
    
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('http://138.68.45.225:3000/api/');
    });

  });
