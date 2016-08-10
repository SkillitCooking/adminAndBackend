'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:contentSectionItem
 * @description
 * # contentSectionItem
 */
angular.module('SkillitAdminApp')
  .directive('contentSectionItem', function () {
    return {
      templateUrl: 'views/contentsectionitem.html',
      restrict: 'E',
      scope: {
        section: '='
      },
      link: function (scope, element, attrs) {
        
      }
    };
  });
