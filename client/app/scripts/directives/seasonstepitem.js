'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:seasonStepItem
 * @description
 * # seasonStepItem
 */
angular.module('SkillitAdminApp')
  .directive('seasonStepItem', function () {
    return {
      templateUrl: 'views/seasonstepitem.html',
      restrict: 'E',
      scope: false,
      transclude: false
    };
  });
