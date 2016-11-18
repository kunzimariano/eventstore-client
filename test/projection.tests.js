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
    requestStub.get = sinon.spy(function(options, cb) {
      cb('error', 'response');
    });

    var name = 'myProjection';
    var partition = 'myPartition';

    var expect = {
      url: '',
      rejectUnauthorized: false,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ=',
      }
    };

    it('should call the proper url with the proper headers when specifying just the name of the projection.', function(done) {
      expect.url = 'http://localhost:1234/projection/' + name + '/state';

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

    it('should call the proper url with the proper headers when specifying the name of the projection and the partition.', function(done) {
      expect.url = 'http://localhost:1234/projection/' + name + '/state?partition=' + partition;

      var projection = new Projection(es);

      projection.getState({
        name: name,
        partition: partition
      }, function(error, response) {
        chai.should();
        requestStub.get.called.should.equal(true);
        requestStub.get.calledWith(expect).should.equal(true);
        done();
      });
    });

  });

  describe('postCommand', function() {
    requestStub.post = sinon.spy(function(options, cb) {
      cb('error', 'response');
    });

    var name = 'someProjection';
    var command = 'enable';

    var expect = {
      url: 'http://localhost:1234/projection/someProjection/command/enable',
      rejectUnauthorized: false,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ=',
      }
    };

    it('should call the proper url with the proper headers when specifying the name of the projection and the command.', function(done) {
      var projection = new Projection(es);

      projection.postCommand({
        name: name,
        command: command
      }, function(error, response) {
        chai.should();
        requestStub.post.called.should.equal(true);
        requestStub.post.calledWith(expect).should.equal(true);
        done();
      });

    });

  });

  describe('enableSystemAll', function(argument) {
    it('should call the proper url with the proper headers and body.', function(done) {

      requestStub.post = sinon.spy(function(options, cb) {
        cb('error', 'response');
      });

      var expect = {
        url: '',
        rejectUnauthorized: false,
        headers: {
          'Content-Length': 0,
          'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ='
        }
      };
      var systemProjections = ['$by_category', '$by_event_type', '$stream_by_category', '$streams'];

      var projection = new Projection(es);
      var iteration = 0;

      projection.enableSystemAll(function(error, response) {
        expect.url = 'http://localhost:1234/projection/' + systemProjections[iteration] + '/command/enable';
        requestStub.post.calledWith(expect).should.equal(true);
        iteration++;

        if (iteration === 4) {
          chai.should();
          requestStub.post.callCount.should.equal(4);
          done();
        }
      });
    });
  });
});