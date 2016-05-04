'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:bakeStepItem
 * @description
 * # bakeStepItem
 */
angular.module('SkillitAdminApp')
  .directive('bakeStepItem', function () {
    return {
      templateUrl: '../views/bakestepitem.html',
      restrict: 'E',
      transclude: false,
      scope: false
    };
  });
