 var request = require('request'),
   assert = require('assert');

 var projections = function(that) {
   this.baseUrl = that.baseUrl + '/projections/';
   this.username = that.username;
   this.password = that.password;
   this.authorization = that.authorization;
   this.rejectUnauthorized = that.rejectUnauthorized;
 };
 projections.prototype.get = function(cb) {
   var url = this.baseUrl + 'all-non-transient';
   console.log(url);

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

 projections.prototype.post = function(args, cb) {
   assert.ok(args.name && args.projection, 'You must specify a name and a projection.');
   // TODO: use boolean
   var url = this.baseUrl +
     'continuous?emit=' + args.emit || 'yes' +
     '&checkpoints=' + args.checkpoints || 'yes'; +
     '&enabled=' + args.enabled || 'yes' +
     '&name=' + args.name;

   var options = {
     url: url,
     rejectUnauthorized: this.rejectUnauthorized,
     headers: {
       'Accept': 'application/json',
       'Authorization': this.authorization,
       'Content-Type': 'application/json;charset=utf-8',
       'Content-Length': args.projection.length
     },
     body: args.projection
   };

   request.post(options, function(err, response) {
     cb(err, response);
   });
 };

 module.exports = projections;