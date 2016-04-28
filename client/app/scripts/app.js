'use strict';

/**
 * @ngdoc overview
 * @name SkillitAdminApp
 * @description
 * # SkillitAdminApp
 *
 * Main module of the application.
 */
angular
  .module('SkillitAdminApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'restangular'
  ])
  .config(function ($routeProvider, RestangularProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/recipes.html',
        controller: 'RecipeCtrl',
        controllerAs: 'recipe'
      })
      .when('/recipes', {
        templateUrl: 'views/recipes.html',
        controller: 'RecipeCtrl',
        controllerAs: 'recipe'
      })
      .when('/ingredients', {
        templateUrl: 'views/ingredients.html',
        controller: 'IngredientCtrl',
        controllerAs: 'ingredient'
      })
      .when('/dishes', {
        templateUrl: 'views/dishes.html',
        controller: 'DishesCtrl',
        controllerAs: 'dishes'
      })
      .when('/seasoningprofiles', {
        templateUrl: 'views/seasoningprofiles.html',
        controller: 'SeasoningprofilesCtrl',
        controllerAs: 'seasoningprofiles'
      })
      .otherwise({
        redirectTo: '/'
      });
    RestangularProvider.setBaseUrl("/api");   
  });
