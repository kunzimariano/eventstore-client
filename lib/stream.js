 var request = require('request'),
   assert = require('assert');

 var stream = function(that) {
   this.baseUrl = that.baseUrl + '/streams/';
   this.username = that.username;
   this.password = that.password;
   this.authorization = that.authorization;
   this.rejectUnauthorized = that.rejectUnauthorized;
 };

 stream.prototype.get = function(args, cb) {
   assert.ok(args.name, 'You must pass the name of the stream you want to push to.')
   // http://your.dns:yourport/streams/streamName/head/5?embed=content
   var url = this.baseUrl + args.name + '/head/' + (args.count || 5) + '?embed=content';

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

 stream.prototype.post = function(args, cb) {
   assert.ok(args.name, 'You must pass the name of the stream you want to push to.')
   assert.ok(args.events, 'You must pass events.')

   var url = this.baseUrl + args.name;

   var options = {
     url: url,
     rejectUnauthorized: this.rejectUnauthorized,
     body: args.events,
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/vnd.eventstore.events+json',
       'Content-Length': events.length,
       'Authorization': this.authorization
     }
   };

   request.post(options, function(error, response) {
     cb(error, response);
   });

 };

 module.exports = stream;