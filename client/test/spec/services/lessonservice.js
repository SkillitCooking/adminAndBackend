'use strict';

describe('Service: lessonService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var lessonService;
  beforeEach(inject(function (_lessonService_) {
    lessonService = _lessonService_;
  }));

  it('should do something', function () {
    expect(!!lessonService).toBe(true);
  });

});
