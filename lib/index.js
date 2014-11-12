var request = require('request'),
  assert = require('assert'),
  Stream = require('./stream'),
  Projection = require('./projection');


var eventStore = function(args) {
  this.baseUrl = args.baseUrl;
  this.username = args.username;
  this.password = args.password;
  this.rejectUnauthorized = args.rejectUnauthorized || false;
  this.authorization = 'Basic ' + new Buffer(this.username + ':' + this.password).toString('base64');

  this.stream = new Stream(this);
  this.projection = new Projection(this);
};

module.exports = eventStore;