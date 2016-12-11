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
    'restangular',
    'ui.select'
  ])
  //lodash support
  .constant('_', window._)
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
      .when('/editRecipes', {
        templateUrl: 'views/editrecipes.html',
        controller: 'EditRecipesCtrl',
        controllerAs: 'editRecipes'
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
      .when('/viewAllRecipes', {
        templateUrl: 'views/viewallrecipes.html',
        controller: 'ViewallrecipesCtrl',
        controllerAs: 'viewAllRecipes'
      })
      .when('/itemCollections', {
        templateUrl: 'views/itemcollections.html',
        controller: 'ItemcollectionsCtrl',
        controllerAs: 'itemCollections'
      })
      .when('/glossaryEntries', {
        templateUrl: 'views/glossaryentries.html',
        controller: 'GlossaryentriesCtrl',
        controllerAs: 'glossaryEntries'
      })
      .when('/trainingVideos', {
        templateUrl: 'views/trainingvideos.html',
        controller: 'TrainingvideosCtrl',
        controllerAs: 'trainingVideos'
      })
      .when('/howToShopEntry', {
        templateUrl: 'views/howtoshopentry.html',
        controller: 'HowtoshopentryCtrl',
        controllerAs: 'howToShopEntry'
      })
      .when('/dailyTips', {
        templateUrl: 'views/dailytips.html',
        controller: 'DailytipsCtrl',
        controllerAs: 'dailyTips'
      })
      .when('/article', {
        templateUrl: 'views/article.html',
        controller: 'ArticleCtrl',
        controllerAs: 'article'
      })
      .when('/lesson', {
        templateUrl: 'views/lesson.html',
        controller: 'LessonCtrl',
        controllerAs: 'lesson'
      })
      .when('/chapter', {
        templateUrl: 'views/chapter.html',
        controller: 'ChapterCtrl',
        controllerAs: 'chapter'
      })
      .when('/editIngredients', {
        templateUrl: 'views/editingredients.html',
        controller: 'EditIngredientsCtrl',
        controllerAs: 'editIngredients'
      })
      .when('/editArticles', {
        templateUrl: 'views/editarticles.html',
        controller: 'EditArticlesCtrl',
        controllerAs: 'editArticles'
      })
      .when('/editLessons', {
        templateUrl: 'views/editlessons.html',
        controller: 'EditLessonsCtrl',
        controllerAs: 'editLessons'
      })
      .when('/editChapter', {
        templateUrl: 'views/editchapter.html',
        controller: 'EditChapterCtrl',
        controllerAs: 'editChapter'
      })
      .when('/editDailyTips', {
        templateUrl: 'views/editdailytips.html',
        controller: 'EditDailytipsCtrl',
        controllerAs: 'editDailyTips'
      })
      .when('/editDishes', {
        templateUrl: 'views/editdishes.html',
        controller: 'EditDishesCtrl',
        controllerAs: 'editDishes'
      })
      .when('/editGlossaryEntries', {
        templateUrl: 'views/editglossaryentries.html',
        controller: 'EditGlossaryEntriesCtrl',
        controllerAs: 'editGlossaryEntries'
      })
      .when('/editHowToShopEntries', {
        templateUrl: 'views/edithowtoshopentries.html',
        controller: 'EditHowToShopEntriesCtrl',
        controllerAs: 'editHowToShopEntries'
      })
      .when('/editItemCollections', {
        templateUrl: 'views/edititemcollections.html',
        controller: 'EditItemCollectionsCtrl',
        controllerAs: 'editItemCollections'
      })
      .when('/editSeasoningProfiles', {
        templateUrl: 'views/editseasoningprofiles.html',
        controller: 'EditSeasoningProfilesCtrl',
        controllerAs: 'editSeasoningProfiles'
      })
      .when('/editTrainingVideos', {
        templateUrl: 'views/edittrainingvideos.html',
        controller: 'EditTrainingVideosCtrl',
        controllerAs: 'editTrainingVideos'
      })
      .when('/dietaryPreferences', {
        templateUrl: 'views/dietarypreferences.html',
        controller: 'DietaryPreferencesCtrl',
        controllerAs: 'dietaryPreferences'
      })
      .when('/editDietaryPreferences', {
        templateUrl: 'views/editdietarypreferences.html',
        controller: 'EditDietaryPreferencesCtrl',
        controllerAs: 'editDietaryPreferences'
      })
      .when('/editRecipeById', {
        templateUrl: 'views/editrecipebyid.html',
        controller: 'EditrecipebyidCtrl',
        controllerAs: 'editRecipeById'
      })
      .otherwise({
        redirectTo: '/'
      });
    RestangularProvider.setBaseUrl("https://skillicookingdevapi.info/api");
    RestangularProvider.setDefaultHeaders({password: "MDm|C7oQQIm&AZyhx4g7m^+uNGqm$7Ctt2-60O&Ek-%0o!NuLT"});
  });
