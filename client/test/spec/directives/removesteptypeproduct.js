'use strict';

describe('Directive: removeStepTypeProduct', function () {

  // load the directive's module
  beforeEach(module('clientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<remove-step-type-product></remove-step-type-product>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the removeStepTypeProduct directive');
  }));
});
