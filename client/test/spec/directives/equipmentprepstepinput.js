'use strict';

describe('Directive: equipmentPrepStepInput', function () {

  // load the directive's module
  beforeEach(module('clientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<equipment-prep-step-input></equipment-prep-step-input>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the equipmentPrepStepInput directive');
  }));
});
