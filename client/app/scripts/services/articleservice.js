'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.articleService
 * @description
 * # articleService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('articleService', function (Restangular, RestangularProductionService) {
    
    var baseArticles = Restangular.all('articles');
    var baseProductionArticles = RestangularProductionService.all('articles');

    return {
      addNewArticle: function(newArticle, useProd, useDev) {
        var promises = [];
        if(useDev) {
          promises.push(baseArticles.post({article: newArticle}));
        }
        if(useProd) {
          promises.push(baseProductionArticles.post({article: newArticle}));
        }
        return Promise.all(promises);
      },
      getArticlesTitleId: function(useProd) {
        if(useProd) {
          return baseProductionArticles.customGET('/getArticlesTitleId');
        } else {
          return baseArticles.customGET('/getArticlesTitleId');
        }
      },
      getAllArticles: function (useProd) {
        if(useProd) {
          return baseProductionArticles.customGET('/');
        } else 
        {
          return baseArticles.customGET('/');
        }
      },
      updateArticle: function(article, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionArticles.customPUT({article: article}, '/' + article._id));
        } 
        if(useDev) {
          promises.push(baseArticles.customPUT({article: article}, '/' + article._id));
        }
        return Promise.all(promises);
      },
      deleteArticle: function(article, useProd, useDev) {
        var promises = [];
        if(useProd) {
          promises.push(baseProductionArticles.customDELETE('/' + article._id));
        }
        if(useDev) {
          promises.push(baseArticles.customDELETE('/' + article._id));
        }
        return Promise.all(promises);
      }
    };
  });
