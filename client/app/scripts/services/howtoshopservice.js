'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.howToShopService
 * @description
 * # howToShopService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('howToShopService', function (Restangular) {
    
    var baseHowToShopEntries = Restangular.all('howToShopEntries');

    return {
      getAllHowToShopEntries: function () {
        return baseHowToShopEntries.customGET('/');
      },
      addNewHowToShopEntry: function(newHowToShopEntry) {
        return baseHowToShopEntries.post(newHowToShopEntry);
      }
    };
  });