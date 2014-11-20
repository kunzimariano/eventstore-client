var chai = require('chai'),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  EventStore = require('../lib/eventstore'),
  es = {},
  requestStub = {},
  Projection = proxyquire('../lib/projection', {
    'request': requestStub
  });

describe('projection', function() {
  before(function() {
    es = new EventStore({
      baseUrl: 'http://localhost:1234',
      username: 'admin',
      password: 'changeit'
    });
  });

  describe('getState', function() {
    it('should call the proper url with the proper headers.', function(done) {

      requestStub.get = sinon.spy(function(options, cb) {
        cb('error', 'response');
      });

      var name = 'myProjection';

      var expect = {
        url: 'http://localhost:1234/projection/' + name + '/state',
        rejectUnauthorized: false,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ=',
        }
      };

      var projection = new Projection(es);

      projection.getState({
        name: name
      }, function(error, response) {
        chai.should();
        requestStub.get.called.should.equal(true);
        requestStub.get.calledWith(expect).should.equal(true);
        done();
      });
    });
  });
});