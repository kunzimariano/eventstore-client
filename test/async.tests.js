var chai = require('chai'),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  es = {},
  requestStub = {},
  EventStore = require('../lib/eventstore'),
  Projection = proxyquire('../lib/projection', {
    'request': requestStub
  }),
  Projections = proxyquire('../lib/projections', {
    'request': requestStub
  }),
  Streams = proxyquire('../lib/streams', {
    'request': requestStub
  });

describe('Async methods', function() {
  before(function() {
    chai.should();

    es = new EventStore({
      baseUrl: 'http://localhost:1234',
      username: 'admin',
      password: 'changeit'
    });

    requestStub.get = sinon.spy(function(options, cb) {
      cb(undefined, 'response');
    });
  });

  describe('Projection', function() {

    it('should have an async version', function(done) {
      var projection = new Projection(es);

      projection.getStateAsync({
        name: 'myProjection'
      }).then(function(response) {
        requestStub.get.called.should.equal(true);
        done();
      });
    });

  });

  describe('Projections', function() {

    it('should have an async version', function(done) {
      var projections = new Projections(es);

      projections.getAsync().then(function(response) {
        requestStub.get.called.should.equal(true);
        done();
      });
    });

  });

  describe('Streams', function() {

    it('should have an async version', function(done) {
      var streams = new Streams(es);

      streams.getAsync({
        name: 'some_name'
      }).then(function(response) {
        requestStub.get.called.should.equal(true);
        done();
      });
    });

  });

});