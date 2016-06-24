'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.itemCollectionService
 * @description
 * # itemCollectionService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('itemCollectionService', function (Restangular) {
    
    var baseItemCollections = Restangular.all('itemCollections');

    return {
      getAllItemCollections: function () {
        return baseItemCollections.customGET('/');
      },
      addNewItemCollection: function (newItemCollection) {
        return baseItemCollections.post(newItemCollection);
      },
      getItemCollectionsForType: function (itemType) {
        return baseItemCollections.customPOST({itemType: itemType}, 'getCollectionsForItemType');
      }
    }
  });
