'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.glossaryService
 * @description
 * # glossaryService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('glossaryService', function (Restangular, RestangularProductionService) {
    
    var baseGlossaryEntries = Restangular.all('glossaryEntries');
    var baseProductionGlossaryEntries = RestangularProductionService.all('glossaryEntries');

    return {
      getAllGlossaryEntries: function (useProd) {
        if(useProd) {
          return baseProductionGlossaryEntries.customGET('/');
        } else {
          return baseGlossaryEntries.customGET('/');
        }
      },
      addNewGlossaryEntry: function (newEntry, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionGlossaryEntries.post(newEntry));
        }
        if(useDev) {
          promises.push(baseGlossaryEntries.post(newEntry));
        }
        return Promise.all(promises);
      },
      updateGlossaryEntry: function(entry, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionGlossaryEntries.customPUT({entry: entry}, '/' + entry._id));
        }
        if(useDev) {
          promises.push(baseGlossaryEntries.customPUT({entry: entry}, '/' + entry._id));
        }
        return Promise.all(promises);
      },
      deleteGlossaryEntry: function(entry, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionGlossaryEntries.customDELETE('/' + entry._id));
        }
        if(useDev) {
          promises.push(baseGlossaryEntries.customDELETE('/' + entry._id));
        }
        return Promise.all(promises);
      }
    };
  });
