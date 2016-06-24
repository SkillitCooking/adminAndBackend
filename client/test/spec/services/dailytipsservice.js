'use strict';

describe('Service: dailyTipsService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var dailyTipsService;
  beforeEach(inject(function (_dailyTipsService_) {
    dailyTipsService = _dailyTipsService_;
  }));

  it('should do something', function () {
    expect(!!dailyTipsService).toBe(true);
  });

});
