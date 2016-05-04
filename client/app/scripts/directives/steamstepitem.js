'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:steamStepItem
 * @description
 * # steamStepItem
 */
angular.module('SkillitAdminApp')
  .directive('steamStepItem', function () {
    return {
      templateUrl: '../views/steamstepitem.html',
      restrict: 'E',
      scope: false,
      transclude: false
    };
  });
