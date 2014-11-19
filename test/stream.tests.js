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
        (requestStub.get.calledWith(expect)).should.equal(true);
        done();

      });
    });

    //it('should return no error and a valid body if the stream exists', function (done) {
    //  es.getLastCommit({ repo: 'somerepo', owner: 'someowner' }, function (error, response, body) {
    //    assert.ok(response);
    //    assert.ok(body);
    //    assert.equal(error, null);
    //    done();
    //  });
    //});

  });

  // describe('pushEvents', function() {
  //   before(function() {
  //     requestStub.post = sinon.stub().callsArgWith(1, null, {});
  //   });

  //   it('should call the proper url with the proper headers', function(done) {
  //     var expect = {
  //       url: 'http://localhost:1234/streams/github-events',
  //       body: '',
  //       rejectUnauthorized: false,
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/vnd.eventstore.events+json',
  //         'Content-Length': 0,
  //         'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ=',
  //       }
  //     };

  //     es.pushEvents('', function(error, response, body) {
  //       assert.equal(requestStub.post.calledWith(expect), true);
  //       done();
  //     });

  //   });
  // });

  // describe('getLastAssets', function() {
  //   before(function() {
  //     requestStub.get = sinon.stub().callsArgWith(1, null, {
  //       body: undefined
  //     });
  //   });

  //   it('should call the proper url with the proper headers', function(done) {
  //     var expect = {
  //       url: 'http://localhost:1234/streams/asset-S-12345/head/backward/6?embed=content',
  //       rejectUnauthorized: false,
  //       headers: {
  //         'Accept': 'application/json',
  //         'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ='
  //       }
  //     };

  //     es.getLastAssets({
  //       workitem: 'S-12345',
  //       pageSize: 6
  //     }, function(error, response) {
  //       assert.equal(requestStub.get.calledWith(expect), true);
  //       done();
  //     });
  //   });

  //   it('should return an empty array', function(done) {
  //     es.getLastAssets({
  //       workitem: 'S-12345',
  //       pageSize: 6
  //     }, function(error, response) {
  //       assert.deepEqual(response, []);
  //       done();
  //     });
  //   });

  // });

});