require('when/es6-shim/Promise');

var insafe = require('..');
var assert = require('assert');

var tests = [
	{ 
		url: '',
		statusCodesAccepted: [],
		statusCodesRefused: [],
		blacklist: [],
		whitelist: [],
		error: true
	},
	{ 
		url: 'foofoofoo',
		statusCodesAccepted: [],
		statusCodesRefused: [],
		blacklist: [],
		whitelist: [],
		error: true
	},
	{ 
		url: 'http://www.google.com/',
		statusCodesAccepted: [],
		statusCodesRefused: [],
		blacklist: [],
		whitelist: [],
		error: false
	},
	{ 
		url: 'http://www.google.com/eewufhdsfsdjiiqwnd',
		statusCodesAccepted: [],
		statusCodesRefused: [],
		blacklist: [],
		whitelist: [],
		error: true
	},
	{ 
		url: 'www.w3.org',
		statusCodesAccepted: [],
		statusCodesRefused: [],
		blacklist: [],
		whitelist: [],
		error: false
	},
	{ 
		url: 'w3.org',
		statusCodesAccepted: ["301"],
		statusCodesRefused: [],
		blacklist: [],
		whitelist: [],
		error: false
	},
	{ 
		url: 'http://www.w3.org',
		statusCodesAccepted: [],
		statusCodesRefused: ["200"],
		blacklist: [],
		whitelist: [],
		error: true
	},
	{ 
		url: 'http://www.w3.org',
		statusCodesAccepted: ["200"],
		statusCodesRefused: [],
		blacklist: ["www.w3.org"],
		whitelist: [],
		error: true
	},
	{ 
		url: 'http://www.w3.org',
		statusCodesAccepted: [],
		statusCodesRefused: [],
		blacklist: [],
		whitelist: ["www.w3.org"],
		error: false
	},
	{ 
		url: 'http://www.google.com',
		statusCodesAccepted: [],
		statusCodesRefused: [],
		blacklist: [],
		whitelist: ["www.w3.org"],
		error: true
	}

];

describe('insafe library for node.js ', function() {
	describe('check method', function() {
		tests.forEach(function(test) {
			if(test.error) {
				var message = test.url + ' should return a non empty report.';
			} else {
				var message = test.url + ' should return an empty report.';
			}
			it(message, function(done) {
				insafe.check(test).then(function(res) {
					if(res.length) {
						assert.equal(test.error, true);
					} else {
						assert.equal(test.error, false);
					}
					done();
				}).catch(function(err) {
				});
			})
		})
	});
});
