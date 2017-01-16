'use strict';

describe('Service: healthModifierService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var healthModifierService;
  beforeEach(inject(function (_healthModifierService_) {
    healthModifierService = _healthModifierService_;
  }));

  it('should do something', function () {
    expect(!!healthModifierService).toBe(true);
  });

});
