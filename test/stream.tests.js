var chai = require('chai'),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  EventStore = require('../lib/eventstore'),
  es = {},
  requestStub = {},
  Stream = proxyquire('../lib/stream', {
    'request': requestStub
  });

describe('stream', function() {
  before(function() {
    es = new EventStore({
      baseUrl: 'http://localhost:1234',
      username: 'admin',
      password: 'changeit'
    });
  });

  describe('get', function() {
    it('should call the proper url with the proper headers', function(done) {

      requestStub.get = sinon.spy(function(options, cb) {
        cb('error', 'response');
      });

      var expect = {
        url: 'http://localhost:1234/stream/streamName/head/5?embed=content',
        rejectUnauthorized: false,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ=',
        }
      };

      var stream = new Stream(es);

      stream.get({
        name: 'streamName'
      }, function(error, response) {
        chai.should();
        requestStub.get.called.should.equal(true);
        requestStub.get.calledWith(expect).should.equal(true);
        done();

      });
    });
  });
  
});