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
      RestangularConfigurer.setBaseUrl('https://skillicookingprodapi.info/api/');
      RestangularConfigurer.setDefaultHeaders({password: "sm@34MLPG9L&rWph|YMwcg=&5|R3TMZ!!H+F48ThGFl56E&*RD"});
    });

  });
