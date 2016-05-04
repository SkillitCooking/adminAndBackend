'use strict';

describe('Directive: seasonStepItem', function () {

  // load the directive's module
  beforeEach(module('clientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<season-step-item></season-step-item>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the seasonStepItem directive');
  }));
});
