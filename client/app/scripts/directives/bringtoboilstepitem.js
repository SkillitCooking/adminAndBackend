'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:bringToBoilStepItem
 * @description
 * # bringToBoilStepItem
 */
angular.module('SkillitAdminApp')
  .directive('bringToBoilStepItem', function () {
    return {
      templateUrl: 'views/bringtoboilstepitem.html',
      restrict: 'E',
      transclude: false,
      scope: false
    };
  });
