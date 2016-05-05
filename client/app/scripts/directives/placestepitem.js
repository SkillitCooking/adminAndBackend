'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:placeStepItem
 * @description
 * # placeStepItem
 */
angular.module('SkillitAdminApp')
  .directive('placeStepItem', function () {
    return {
      templateUrl: 'views/placestepitem.html',
      restrict: 'E',
      transclude: false,
      scope: false
    };
  });
