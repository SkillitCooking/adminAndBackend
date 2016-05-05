'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:boilStepItem
 * @description
 * # boilStepItem
 */
angular.module('SkillitAdminApp')
  .directive('boilStepItem', function () {
    return {
      templateUrl: 'views/boilstepitem.html',
      restrict: 'E',
      scope: false,
      transclude: false
    };
  });
