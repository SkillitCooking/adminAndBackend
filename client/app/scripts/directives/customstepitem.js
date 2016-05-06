'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:customStepItem
 * @description
 * # customStepItem
 */
angular.module('SkillitAdminApp')
  .directive('customStepItem', function () {
    return {
      templateUrl: 'views/customstepitem.html',
      restrict: 'E',
      scope: false,
      transclude: false
    };
  });
