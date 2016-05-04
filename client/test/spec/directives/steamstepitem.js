'use strict';

describe('Directive: steamStepItem', function () {

  // load the directive's module
  beforeEach(module('clientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<steam-step-item></steam-step-item>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the steamStepItem directive');
  }));
});
