 var request = require('request'),
   assert = require('assert');

 var stream = function(eventstore) {
   this.es = eventstore;
   this.resourceUrl = this.es.baseUrl + '/streams/';
 };

 stream.prototype.get = function(args, cb) {
   assert.ok(args.name, 'You must pass the name of the stream you want to get from.')
   // http://your.dns:yourport/streams/streamName/head/5?embed=content
   var url = this.resourceUrl + args.name + '/head/' + (args.count || 5) + '?embed=content';

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

 stream.prototype.post = function(args, cb) {
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
       'Content-Length': args.events.length,
       'Authorization': this.es.authorization
     }
   };

   request.post(options, function(error, response) {
     cb(error, response);
   });

 };

 module.exports = stream;