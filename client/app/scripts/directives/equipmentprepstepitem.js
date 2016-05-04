'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:equipmentPrepStepItem
 * @description
 * # equipmentPrepStepItem
 */
angular.module('SkillitAdminApp')
  .directive('equipmentPrepStepItem', function () {
    return {
      templateUrl: '../views/equipmentprepstepitem.html',
      restrict: 'E',
      scope: false,
      transclude: false
    };
  });
