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
		expected: false
	},
	{ 
		url: 'foofoofoo',
		statusCodesAccepted: [],
		statusCodesRefused: [],
		blacklist: [],
		whitelist: [],
		expected: false
	},
	{ 
		url: 'http://www.google.com/',
		expected: true
	},
	{ 
		url: 'http://www.google.com/eewufhdsfsdjiiqwnd',
		statusCodesAccepted: [],
		statusCodesRefused: [],
		blacklist: [],
		whitelist: [],
		expected: false
	},
	{ 
		url: 'www.w3.org',
		expected: true
	},
	{ 
		url: 'w3.org',
		statusCodesAccepted: ["301"],
		expected: true
	},
	{ 
		url: 'http://www.w3.org',
		statusCodesAccepted: [],
		statusCodesRefused: ["200"],
		blacklist: [],
		whitelist: [],
		expected: false
	},
	{ 
		url: 'http://www.w3.org',
		statusCodesAccepted: ["200"],
		statusCodesRefused: [],
		blacklist: ["www.w3.org"],
		whitelist: [],
		expected: false
	},
	{ 
		url: 'http://www.w3.org',
		statusCodesAccepted: [],
		statusCodesRefused: [],
		blacklist: [],
		whitelist: ["www.w3.org"],
		expected: true
	},
	{ 
		url: 'http://www.google.com',
		statusCodesAccepted: [],
		statusCodesRefused: [],
		blacklist: [],
		whitelist: ["www.w3.org"],
		expected: false
	}

];

describe('insafe library for node.js ', function() {
	describe('check method', function() {
		tests.forEach(function(test) {
			if(test.expected == true) {
				var message = test.url + ' should be safe.';
			} else {
				var message = test.url + ' should not be safe.';
			}
			it(message, function(done) {
				insafe.check(test).then(function(res) {
					console.log(res.status);
					console.log(test.expected);
					assert.equal(test.expected, res.status);
					done();
				}).catch(function(err) {
					console.log(err);
					done();
				});
			})
		})
	});
});
