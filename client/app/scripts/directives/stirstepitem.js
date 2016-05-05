'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:stirStepItem
 * @description
 * # stirStepItem
 */
angular.module('SkillitAdminApp')
  .directive('stirStepItem', function () {
    return {
      templateUrl: 'views/stirstepitem.html',
      restrict: 'E',
      transclude: false,
      scope: false,
      link: function (scope, element, attrs) {
        
      }
    };
  });
