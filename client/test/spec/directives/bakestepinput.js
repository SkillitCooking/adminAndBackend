'use strict';

describe('Directive: bakeStepInput', function () {

  // load the directive's module
  beforeEach(module('clientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bake-step-input></bake-step-input>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bakeStepInput directive');
  }));
});
