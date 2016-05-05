'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:slowCookStepItem
 * @description
 * # slowCookStepItem
 */
angular.module('SkillitAdminApp')
  .directive('slowCookStepItem', function () {
    return {
      templateUrl: 'views/slowcookstepitem.html',
      restrict: 'E',
      scope: false,
      transclude: false
    };
  });
