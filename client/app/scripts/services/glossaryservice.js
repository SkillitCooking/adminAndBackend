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
      }
    };
  });
