var request = require('request'),
  assert = require('assert');

var projection = function(that) {
  this.baseUrl = that.baseUrl + '/projection/';
  this.username = that.username;
  this.password = that.password;
  this.authorization = that.authorization;
  this.rejectUnauthorized = that.rejectUnauthorized;
};

projection.prototype.getState = function(args, cb) {
  var url = this.baseUrl + args.name;
  var options = {
    url: url,
    rejectUnauthorized: this.rejectUnauthorized,
    headers: {
      'Accept': 'application/json',
      'Authorization': this.authorization
    }
  };

  request.get(options, function(error, response) {
    cb(error, response);
  });

};

module.exports = projection;