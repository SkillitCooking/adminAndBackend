'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.howToShopService
 * @description
 * # howToShopService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('howToShopService', function (Restangular, RestangularProductionService) {
    
    var baseHowToShopEntries = Restangular.all('howToShopEntries');
    var baseProductionHowToShopEntries = RestangularProductionService.all('howToShopEntries')

    return {
      getAllHowToShopEntries: function (useProd) {
        if(useProd) {
          return baseProductionHowToShopEntries.customGET('/');
        } else {
          return baseHowToShopEntries.customGET('/');
        }
      },
      addNewHowToShopEntry: function(newHowToShopEntry, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionHowToShopEntries.post(newHowToShopEntry));
        }
        if(useDev) {
          promises.push(baseHowToShopEntries.post(newHowToShopEntry));
        }
        return Promise.all(promises);
      },
      updateHowToShopEntry: function(entry, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionHowToShopEntries.customPUT({entry: entry}, '/' + entry._id));
        }
        if(useDev) {
          promises.push(baseHowToShopEntries.customPUT({entry: entry}, '/' + entry._id));
        }
        return Promise.all(promises);
      },
      deleteHowToShopEntry: function(entry, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionHowToShopEntries.customDELETE('/' + entry._id));
        }
        if(useDev) {
          promises.push(baseHowToShopEntries.customDELETE('/' + entry._id));
        }
        return Promise.all(promises);
      }
    };
  });
