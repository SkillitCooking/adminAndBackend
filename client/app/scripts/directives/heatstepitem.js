'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:heatStepItem
 * @description
 * # heatStepItem
 */
angular.module('SkillitAdminApp')
  .directive('heatStepItem', function () {
    return {
      templateUrl: 'views/heatstepitem.html',
      restrict: 'E',
      transclude: false,
      scope: false
    };
  });
