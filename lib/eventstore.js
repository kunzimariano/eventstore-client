var assert = require('assert'),
  Stream = require('./stream'),
  Projections = require('./projections'),
  Projection = require('./projection');


var eventStore = function(args) {
  assert.ok(args.baseUrl && args.username && args.password, 'You must specify a baseUrl, username and password.');

  this.baseUrl = args.baseUrl;
  this.username = args.username;
  this.password = args.password;
  this.rejectUnauthorized = args.rejectUnauthorized || false;
  this.authorization = 'Basic ' + new Buffer(this.username + ':' + this.password).toString('base64');

  this.stream = new Stream(this);
  this.projections = new Projections(this);
  this.projection = new Projection(this);
};

module.exports = eventStore;