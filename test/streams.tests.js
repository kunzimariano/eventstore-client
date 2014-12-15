var chai = require('chai'),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  EventStore = require('../lib/eventstore'),
  es = {},
  requestStub = {},
  Streams = proxyquire('../lib/streams', {
    'request': requestStub
  });

describe('streams', function() {
  before(function() {
    es = new EventStore({
      baseUrl: 'http://localhost:1234',
      username: 'admin',
      password: 'changeit'
    });
  });

  describe('get', function() {
    it('should call the proper url with the proper headers.', function(done) {

      requestStub.get = sinon.spy(function(options, cb) {
        cb('error', 'response');
      });

      var expect = {
        url: 'http://localhost:1234/streams/streamName/head/5?embed=content',
        rejectUnauthorized: false,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ=',
        }
      };

      var streams = new Streams(es);

      streams.get({
        name: 'streamName'
      }, function(error, response) {
        chai.should();
        requestStub.get.called.should.equal(true);
        requestStub.get.calledWith(expect).should.equal(true);
        done();

      });
    });
  });

  describe('post', function() {
    it('should call the proper url with the proper headers and body.', function(done) {

      requestStub.post = sinon.spy(function(options, cb) {
        cb('error', 'response');
      });

      var body = '{ "someproperty" : "somevalue" }';

      var expect = {
        url: 'http://localhost:1234/streams/streamName',
        rejectUnauthorized: false,
        body: body,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/vnd.eventstore.events+json',
          'Content-Length': body.length,
          'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ='
        }
      };

      var streams = new Streams(es);

      streams.post({
        name: 'streamName',
        events: '{ "someproperty" : "somevalue" }',
      }, function(error, response) {
        chai.should();
        requestStub.post.called.should.equal(true);
        requestStub.post.calledWith(expect).should.equal(true);
        done();

      });
    });
  });

});