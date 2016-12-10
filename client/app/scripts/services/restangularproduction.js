'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.restangularProduction
 * @description
 * # restangularProduction
 * Factory in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('RestangularProductionService', function (Restangular, API_PASSWORDS) {
    
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('https://skillicookingprodapi.info/api/');
      RestangularConfigurer.setDefaultHeaders({password: API_PASSWORDS.PROD});
    });

  });
