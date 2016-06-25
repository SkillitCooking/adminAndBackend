'use strict';

describe('Service: glossaryService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var glossaryService;
  beforeEach(inject(function (_glossaryService_) {
    glossaryService = _glossaryService_;
  }));

  it('should do something', function () {
    expect(!!glossaryService).toBe(true);
  });

});
