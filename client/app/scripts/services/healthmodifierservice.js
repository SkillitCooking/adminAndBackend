'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.healthModifierService
 * @description
 * # healthModifierService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('healthModifierService', function (Restangular, RestangularProductionService) {
    var baseHealthModifier = Restangular.all('healthModifiers');
    var baseProductionHealthModifier = RestangularProductionService.all('healthModifiers');

    return {
      getAllHealthModifiers: function(useProd) {
        if(useProd) {
          return baseProductionHealthModifier.customGET('/');
        } else {
          return baseHealthModifier.customGET('/');
        }
      },
      addNewHealthModifier: function(newHealthModifier, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionHealthModifier.post(newHealthModifier));
        }
        if(useDev) {
          promises.push(baseHealthModifier.post(newHealthModifier));
        }
        return Promise.all(promises);
      },
      updateHealthModifier: function(healthModifier, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionHealthModifier.customPUT({healthModifier: healthModifier}, '/' + healthModifier._id));
        }
        if(useDev) {
          promises.push(baseHealthModifier.customPUT({healthModifier: healthModifier}, '/' + healthModifier._id));
        }
        return Promise.all(promises);
      },
      deleteHealthModifier: function(healthModifier, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionHealthModifier.customDELETE('/' + healthModifier._id));
        }
        if(useDev) {
          promises.push(baseHealthModifier.customDELETE('/' + healthModifier._id));
        }
        return Promise.all(promises);
      }
    };
  });
