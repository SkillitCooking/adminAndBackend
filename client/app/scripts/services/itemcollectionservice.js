'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.itemCollectionService
 * @description
 * # itemCollectionService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('itemCollectionService', function (Restangular, RestangularProductionService) {
    
    var baseItemCollections = Restangular.all('itemCollections');
    var baseProductionItemCollections = RestangularProductionService.all('itemCollections');

    return {
      getAllItemCollections: function (useProd) {
        if(useProd) {
          return baseProductionItemCollections.customGET('/');
        } else {
          return baseItemCollections.customGET('/');
        }
      },
      addNewItemCollection: function (newItemCollection, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionItemCollections.post(newItemCollection));
        }
        if(useDev) {
          promises.push(baseItemCollections.post(newItemCollection));
        }
        return Promise.all(promises);
      },
      getItemCollectionsForType: function (itemType, useProd) {
        if(useProd) {
          return baseProductionItemCollections.customPOST({itemType: itemType}, 'getCollectionsForItemType');
        } else {
          return baseItemCollections.customPOST({itemType: itemType}, 'getCollectionsForItemType');
        }
      },
      updateItemCollection: function(collection, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionItemCollections.customPUT({collection: collection}, '/' + collection._id));
        }
        if(useDev) {
          promises.push(baseItemCollections.customPUT({collection: collection}, '/' + collection._id));
        }
        return Promise.all(promises);
      },
      deleteItemCollection: function(collection, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionItemCollections.customDELETE('/' + collection._id));
        }
        if(useDev) {
          promises.push(baseItemCollections.customDELETE('/' + collection._id));
        }
        return Promise.all(promises);
      },
      updateItemCollectionBulk: function(collection, recipeIds, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionItemCollections.customPUT({collection: collection, recipeIds: recipeIds}, 'bulk/' + collection._id));
        } 
        if(useDev) {
          promises.push(baseItemCollections.customPUT({collection: collection, recipeIds: recipeIds}, 'bulk/' + collection._id));
        }
        return Promise.all(promises);
      },
      addNewItemCollectionBulk: function(newItemCollection, recipeIds, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionItemCollections.customPOST({collection: newItemCollection.itemCollection, recipeIds: recipeIds}, 'addBulk'));
        } 
        if(useDev) {
          promises.push(baseItemCollections.customPOST({collection: newItemCollection.itemCollection, recipeIds: recipeIds}, 'addBulk'));
        }
        return Promise.all(promises);
      }
    };
  });
