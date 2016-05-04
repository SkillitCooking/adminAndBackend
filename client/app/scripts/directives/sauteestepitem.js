'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:sauteeStepItem
 * @description
 * # sauteeStepItem
 */
angular.module('SkillitAdminApp')
  .directive('sauteeStepItem', function () {
    return {
      templateUrl: '../views/sauteestepitem.html',
      restrict: 'E',
      scope: false,
      transclude: false
    };
  });
