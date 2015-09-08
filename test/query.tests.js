var chai = require('chai'),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  EventStore = require('../lib/eventstore'),
  es = {},
  requestStub = {},
  Query = proxyquire('../lib/query', {
    'request': requestStub
  });

describe('query', function() {
  before(function() {
    es = new EventStore({
      baseUrl: 'http://localhost:1234',
      username: 'admin',
      password: 'changeit'
    });
  });

  describe('getState', function() {
    requestStub.get = sinon.spy(function(options, cb) {
      cb('error', 'response');
    });

    var id = 'myTransientGuid';

    var expect = {
      url: '',
      rejectUnauthorized: false,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ=',
      }
    };

    it('should call the proper url with the proper headers when specifying just the id of the transient projection.', function(done) {
      expect.url = 'http://localhost:1234/projection/' + id + '/state';

      var query = new Query(es);

      query.getState({
        id: id
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

      var body = 'a string with the query definition';

      var expect = {
        url: 'http://localhost:1234/projections/transient?emit=no&checkpoints=no&enabled=yes',
        rejectUnauthorized: false,
        body: body,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          'Content-Length': body.length,
          'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ='
        }
      };

      var query = new Query(es);

      query.post({
        projection: body
      }, function(error, response) {
        chai.should();
        requestStub.post.called.should.equal(true);
        requestStub.post.calledWith(expect).should.equal(true);
        done();
      });
    });
  });
});