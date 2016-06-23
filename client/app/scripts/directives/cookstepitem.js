'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:cookstepitem
 * @description
 * # cookstepitem
 */
angular.module('SkillitAdminApp')
  .directive('cookstepitem', function () {
    return {
      templateUrl: 'views/cookstepitem.html',
      scope: false,
      transclude: false,
      restrict: 'E'
    };
  });
