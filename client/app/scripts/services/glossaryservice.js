'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.glossaryService
 * @description
 * # glossaryService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('glossaryService', function (Restangular) {
    
    var baseGlossaryEntries = Restangular.all('glossaryEntries');

    return {
      getAllGlossaryEntries: function () {
        return baseGlossaryEntries.customGET('/');
      },
      addNewGlossaryEntry: function (newEntry) {
        return baseGlossaryEntries.post(newEntry);
      },
      updateGlossaryEntry: function(entry) {
        return baseGlossaryEntries.customPUT({entry: entry}, '/' + entry._id);
      },
      deleteGlossaryEntry: function(entry) {
        return baseGlossaryEntries.customDELETE('/' + entry._id);
      }
    };
  });
