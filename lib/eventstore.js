var assert = require('assert'),
  Streams = require('./streams'),
  Projections = require('./projections'),
  Projection = require('./projection'),
  Query = require('./query');


var eventStore = function(args) {
  assert.ok(args.baseUrl && args.username && args.password, 'You must specify a baseUrl, username and password.');

  this.baseUrl = args.baseUrl;
  this.username = args.username;
  this.password = args.password;
  this.rejectUnauthorized = args.rejectUnauthorized || false;
  this.authorization = 'Basic ' + new Buffer(this.username + ':' + this.password).toString('base64');

  this.streams = new Streams(this);
  this.projections = new Projections(this);
  this.projection = new Projection(this);
  this.query = new Query(this);
};

module.exports = eventStore;