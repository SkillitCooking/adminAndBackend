'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:dryStepItem
 * @description
 * # dryStepItem
 */
angular.module('SkillitAdminApp')
  .directive('dryStepItem', function () {
    return {
      templateUrl: 'views/drystepitem.html',
      restrict: 'E',
      scope: false,
      transclude: false
    };
  });
