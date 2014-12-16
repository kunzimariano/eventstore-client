var request = require('request'),
  assert = require('assert');

var projection = function(eventstore) {
  this.es = eventstore;
  this.resourceUrl = this.es.baseUrl + '/projection/';
};

projection.prototype.getState = function(args, cb) {
  assert.ok(args.name, 'You must specify a name and a projection.');

  var url = this.resourceUrl + args.name + '/state';

  if (args.partition) {
    url += '?partition=' + args.partition;
  }

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

module.exports = projection;