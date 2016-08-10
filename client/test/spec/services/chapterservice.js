'use strict';

describe('Service: chapterService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var chapterService;
  beforeEach(inject(function (_chapterService_) {
    chapterService = _chapterService_;
  }));

  it('should do something', function () {
    expect(!!chapterService).toBe(true);
  });

});
