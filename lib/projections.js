var request = require('request'),
  assert = require('assert'),
  Promise = require("bluebird");

var projections = function(eventstore) {
  this.es = eventstore;
  this.resourceUrl = this.es.baseUrl + '/projections/';
};

projections.prototype.get = function(cb) {
  var url = this.resourceUrl + 'all-non-transient';

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

};

projections.prototype.post = function(args, cb) {
  assert.ok(args.name && args.projection, 'You must specify a name and a projection.');
  // TODO: use boolean
  var url = this.resourceUrl +
    'continuous?emit=' + (args.emit || 'yes') +
    '&checkpoints=' + (args.checkpoints || 'yes') +
    '&enabled=' + (args.enabled || 'yes') +
    '&name=' + args.name;

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
};

Promise.promisifyAll(projections.prototype);
module.exports = projections;