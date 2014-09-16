#Safe Url Input Checker

Safe Url Input Checker is a node.js library to check url safety.

#Dependencies

[ip](https://github.com/indutny/node-ip) 

[Q](https://github.com/kriskowal/q)

#API

for some methods you can use callback or not. Just few methods require a callback especially.

	var urlChecker = require('safe-url-input-checker')

checkUrlSafety

````javascript
	var options = {};
	options.blacklist = [
		'joker.com',
		'slade.io',
		'twoface.net',
		'...',
		'magneto.vilain'
	];
	options.protocolScheme = [
		'http',
		'https',
		'ftp'
	];
	urlChecker.checkUrlSafety('localhost', function(err, res) {
		console.log(res); // false
	});
	urlChecker.checkUrlSafety('http://batman.com', function(err, res) {
		console.log(res); // true
	});
	urlChecker.checkUrlSafety('http://joker.com', function(err, res) {
		console.log(res); // false
	}, options);
	urlChecker.checkUrlSafety('w3.com', function(err, res) {
		console.log(res); // true
	}, options);
````

getIPAddresses (optional callback)
	
````javascript
	urlChecker.getIPAddresses('localhost', function(err, res) {
		if(err) throw err;
		console.log(res); // ['127.0.0.1']
	});
````

isAddressLocal (optional callback)

````javascript
	urlChecker.isAddressLocal('127.0.0.1', function(err, res) {
		if(err) throw err;
		console.log(res) // true
	});
````

isHostLocal (requested callback)

````javascript
	urlChecker.isHostLocal('google.com', function(err, res) {
		if(err) throw err;
		console.log(res) // false
	});
````

isHostBlacklisted (optional callback)

````javascript
	var blacklist = [
	'joker.com',
	'slade.io',
	'twoface.net',
	'...',
	'magneto.vilain'
	];
	urlChecker.isHostBlacklisted('joker.com', blacklist, function(err, res) {
		console.log(res); // true
	});
````

isProtocolAcceptable (optional callback)

````javascript
	var protocolScheme = [
		'http',
		'https',
		'ftp'
	];
	urlChecker.isProtocolAcceptable('http', protocolScheme, function(err, res) {
		console.log(res); // true
	});
````

resolveAndParseUrl (optional callback)

````javascript
	urlChecker.resolveAndParseUrl('google.com', function(err, res) {
		console.log(res) // url object
	});
````
#Licence

Copyright (c) 2014 Guillaume Baudusseau

MIT
