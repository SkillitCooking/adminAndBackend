'use strict';

/**
 * @ngdoc directive
 * @name SkillitAdminApp.directive:selectRefresh
 * @description
 * # selectRefresh
 */
angular.module('SkillitAdminApp')
  .directive('selectRefresh', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        options: '='
      },
      link: function (scope, element, attrs) {
        scope.$watch(scope.options, function(value) {
          if(value) {
            scope.$evalAsync(function() {
              element.selectpicker('refresh');
            });
          }
        });
        
      }
    };
  });
