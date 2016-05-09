'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:preheatOvenStepItem
 * @description
 * # preheatOvenStepItem
 */
angular.module('SkillitAdminApp')
  .directive('preheatOvenStepItem', function () {
    return {
      templateUrl: 'views/preheatovenstepitem.html',
      restrict: 'E',
      scope: false,
      transclude: false
    };
  });
