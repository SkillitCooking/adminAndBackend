'use strict';

describe('Directive: stirStepItem', function () {

  // load the directive's module
  beforeEach(module('clientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<stir-step-item></stir-step-item>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the stirStepItem directive');
  }));
});
