'use strict';

/**
 * @ngdoc service
 * @name SkillitAdminApp.articleService
 * @description
 * # articleService
 * Service in the SkillitAdminApp.
 */
angular.module('SkillitAdminApp')
  .factory('articleService', function (Restangular) {
    
    var baseArticles = Restangular.all('articles');

    return {
      addNewArticle: function(newArticle) {
        return baseArticles.post({article: newArticle});
      },
      getArticlesTitleId: function() {
        return baseArticles.customGET('/getArticlesTitleId');
      },
      getAllArticles: function () {
        return baseArticles.customGET('/');
      },
      updateArticle: function(article) {
        return baseArticles.customPUT({article: article}, '/' + article._id);
      },
      deleteArticle: function(article) {
        return baseArticles.customDELETE('/' + article._id);
      }
    };
  });
