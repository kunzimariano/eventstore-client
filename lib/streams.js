var request = require('request'),
  assert = require('assert'),
  Promise = require("bluebird");

var streams = function(eventstore) {
  this.es = eventstore;
  this.resourceUrl = this.es.baseUrl + '/streams/';
};

streams.prototype.get = function(args, cb) {
  assert.ok(args.name || args.pageUrl, 'You must specify the name of the stream you want to get from or a pageUrl.')
  var embedType = args.embed || 'content';
  var url;
  if (args.pageUrl) {

    url = args.pageUrl + '?embed=' + embedType;
  } else {
    // http://your.dns:yourport/streams/streamName/head/25?embed=content
    url = this.resourceUrl + args.name + '/head/' + (args.count || 25) + '?embed=' + embedType;
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

streams.prototype.post = function(args, cb) {
  assert.ok(args.name, 'You must pass the name of the stream you want to push to.')
  assert.ok(args.events, 'You must pass events.')

  var url = this.resourceUrl + args.name;

  var options = {
    url: url,
    rejectUnauthorized: this.es.rejectUnauthorized,
    body: args.events,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/vnd.eventstore.events+json',
      'Authorization': this.es.authorization
    }
  };

  request.post(options, function(error, response) {
    cb(error, response);
  });

};

Promise.promisifyAll(streams.prototype);
module.exports = streams;