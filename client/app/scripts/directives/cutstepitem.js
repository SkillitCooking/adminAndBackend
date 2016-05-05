'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:cutStepItem
 * @description
 * # cutStepItem
 */
angular.module('SkillitAdminApp')
  .directive('cutStepItem', function () {
    return {
      templateUrl: 'views/cutstepitem.html',
      restrict: 'E',
      scope: false,
      transclude: false
    };
  });
