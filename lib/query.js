var request = require('request'),
  assert = require('assert'),
  Promise = require("bluebird");

var query = function(eventstore) {
  this.es = eventstore;
  this.resourceUrl = this.es.baseUrl;
};

query.prototype.post = function(args, cb) {
  assert.ok(args.projection, 'You must specify a projection.');
  // TODO: use boolean
  var url = this.resourceUrl + '/projections/' +
    'transient?emit=' + (args.emit || 'no') +
    '&checkpoints=' + (args.checkpoints || 'no') +
    '&enabled=' + (args.enabled || 'yes');

  var options = {
    url: url,
    rejectUnauthorized: this.es.rejectUnauthorized,
    headers: {
      'Accept': 'application/json',
      'Authorization': this.es.authorization,
      'Content-Type': 'application/json;charset=utf-8',
      'Content-Length': args.projection.length
    },
    body: args.projection
  };
  request.post(options, function(err, response) {
    cb(err, response);
  });
}

query.prototype.getStatus = function(args, cb) {

  var url = this.resourceUrl + '/projection/' + args.id;

  var options = {
    url: url,
    rejectUnauthorized: this.es.rejectUnauthorized,
    headers: {
      'Accept': 'application/json',
      'Authorization': this.es.authorization
    }
  };
  request.get(options, function(error, response) {
    cb(error, response);
  });
}

query.prototype.getState = function(args, cb) {

  var url = this.resourceUrl + '/projection/' + args.id + '/state';

  var options = {
    url: url,
    rejectUnauthorized: this.es.rejectUnauthorized,
    headers: {
      'Accept': 'application/json',
      'Authorization': this.es.authorization
    }
  };
  request.get(options, function(error, response) {
    cb(error, response);
  });
}

Promise.promisifyAll(query.prototype);
module.exports = query;