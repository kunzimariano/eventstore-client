var chai = require('chai'),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  EventStore = require('../lib/eventstore'),
  es = {},
  requestStub = {},
  Projections = proxyquire('../lib/projections', {
    'request': requestStub
  });

describe('projections', function() {
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
        url: 'http://localhost:1234/projections/all-non-transient',
        rejectUnauthorized: false,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ=',
        }
      };

      var projections = new Projections(es);

      projections.get(function(error, response) {
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

      var name = 'myprojection';
      var body = 'console.log("this projection does nothing useful.")';

      var expect = {
        url: 'http://localhost:1234/projections/continuous?emit=yes&checkpoints=yes&enabled=yes&name=' + name,
        rejectUnauthorized: false,
        body: body,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          'Content-Length': body.length,
          'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ='
        }
      };

      var projections = new Projections(es);

      projections.post({
        name: name,
        projection: body,
      }, function(error, response) {
        chai.should();
        requestStub.post.called.should.equal(true);
        requestStub.post.calledWith(expect).should.equal(true);
        done();

      });
    });
  });
});