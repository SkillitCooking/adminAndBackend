'use strict';

describe('Service: dietaryPreferenceService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var dietaryPreferenceService;
  beforeEach(inject(function (_dietaryPreferenceService_) {
    dietaryPreferenceService = _dietaryPreferenceService_;
  }));

  it('should do something', function () {
    expect(!!dietaryPreferenceService).toBe(true);
  });

});
