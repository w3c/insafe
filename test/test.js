var suich = require('..'),
	assert = require('assert'),
	Q = require('q');

describe('safe url input checker library for node.js ', function() {

	describe('getIPAddresses() method', function() {
		it('#1 should get IP addresses', function(done) {
			suich.getIPAddresses('w3.org', function(err, res) {
				assert.equal(res, "128.30.52.45");
				done();
			});
		});
		it('#2 should get IP addresses', function(done) {
			suich.getIPAddresses('localhost', function(err, res) {
				assert.equal(res, "127.0.0.1");
				done();
			});
		});
		it('#3 should not get IP addresses', function(done) {
			suich.getIPAddresses('foofoofoofoofooofooofooofoofoofofofofoofoo.com', function(err, res) {
				assert.ifError(res);
				done();
			});
		});
	});

	describe('isAddressLocal() method', function() {
		it('#1 should return true', function() {
			suich.isAddressLocal('127.0.0.1', function(err, res) {
				assert.equal(res, true);
			});
		});
		it('#2 should return false', function() {
			suich.isAddressLocal('128.30.52.45', function(err, res) {
				assert.equal(res, false);
			});
		});
		it('#3 should return true', function() {
			assert.equal(suich.isAddressLocal('127.0.0.1'), true);
		});
		it('#4 should return false', function() {
			assert.equal(suich.isAddressLocal('128.30.52.45'), false);
		});
	});

	describe('isHostLocal() method', function() {
		it('#1 should return true', function() {
			suich.isHostLocal('localhost', function(err, res) {
				assert.equal(res, true);
			});
		});
		it('#2 should return false', function() {
			suich.isHostLocal('google.com', function(err, res) {
				assert.equal(res, false);
			});
		});
	});

	describe('isHostBlacklisted() method', function() {
		it('#1 should return true', function() {
			suich.isHostBlacklisted('google.com', ['google.com', 'w3.org'], function(err, res) {
				assert.equal(res, true);
			});
		});
		it('#2 should return false', function() {
			suich.isHostBlacklisted('foofoofoo.com', ['google.com', 'w3.org'], function(err, res) {
				assert.equal(res, false);
			});
		});
		it('#3 should return false', function() {
			suich.isHostBlacklisted('foofoofoo.com', [], function(err, res) {
				assert.equal(res, false);
			});
		});
		it('#4 should return true', function() {
			assert.equal(suich.isHostBlacklisted('google.com', ['google.com', 'w3.org']), true);
		});
		it('#5 should return false', function() {
			assert.equal(suich.isHostBlacklisted('foofoofoo.com', ['google.com', 'w3.org']), false);
		});
		it('#6 should return false', function() {
			assert.equal(suich.isHostBlacklisted('foofoofoo.com', []), false);
		});
	});

	describe('isProtocolAcceptable() method', function() {
		it('#1 should return true', function() {
			suich.isProtocolAcceptable('http', ['http', 'ftp', 'https'], function(err, res) {
				assert.equal(res, true);
			});
		});
		it('#2 should return false', function() {
			suich.isProtocolAcceptable('ftp', ['http', 'https'], function(err, res) {
				assert.equal(res, false);
			});
		});
		it('#3 should return true', function() {
			suich.isProtocolAcceptable('https', null, function(err, res) {
				assert.equal(res, true);
			});
		});
		it('#4 should return false', function() {
			suich.isProtocolAcceptable('ftp', null, function(err, res) {
				assert.equal(res, false);
			});
		});
		it('#5 should return true', function() {
			assert.equal(suich.isProtocolAcceptable('http', ['http', 'ftp', 'https']), true);
		});
		it('#6 should return false', function() {
			assert.equal(suich.isProtocolAcceptable('ftp', ['http', 'https']), false);
		});
		it('#7 should return true', function() {
			assert.equal(suich.isProtocolAcceptable('https'), true);
		});
		it('#8 should return false', function() {
			assert.equal(suich.isProtocolAcceptable('ftp'), false);
		});
	});

	describe('resolveAndParseUrl() method', function() {
		it('#1 should return url object (parsed)', function() {
			suich.resolveAndParseUrl('google.com', function(err, res) {
				assert.equal(res.href, 'http://google.com/');
				assert.equal(res.protocol, 'http:');
				assert.equal(res.host, 'google.com');
				assert.equal(res.hostname, 'google.com');
				assert.equal(res.port, null);
				assert.equal(res.path, '/');
			});
		});
		it('#2 should return url object (parsed)', function() {
			assert.equal(suich.resolveAndParseUrl('google.com').href, 'http://google.com/');
			assert.equal(suich.resolveAndParseUrl('google.com').protocol, 'http:');
			assert.equal(suich.resolveAndParseUrl('google.com').host, 'google.com');
			assert.equal(suich.resolveAndParseUrl('google.com').hostname, 'google.com');
			assert.equal(suich.resolveAndParseUrl('google.com').port, null);
			assert.equal(suich.resolveAndParseUrl('google.com').path, '/');
		});
	});

	describe('checkUrlSafety() method', function() {

		var goodUrls = [
			'http://www.w3.org/index.html',
			'https://w3.org:8080/Overview.html'
		];
		var badUrls = [
			'file:///etc/passwd',
			'rsync://w3.org/',
			'http://localhost/server-status',
			'http://localhost:8001/2012/pyRdfa/Overview.html'
		];
		it('#1 should return true', function(done) {
			suich.checkUrlSafety('w3.org', function(err, res) {
				assert.equal(res, 'http://w3.org/');
				done();
			}, null);
		});

		for (var index in goodUrls) {
			it('#1 should return true', function(done) {
				suich.checkUrlSafety(goodUrls[index], function(err, res) {
					assert.equal(res, goodUrls[index]);
					done();
				}, null);
			});
		}

		for (var index in goodUrls) {
			it('#1 should return false', function(done) {
				suich.checkUrlSafety(badUrls[index], function(err, res) {
					assert.equal(res, false);
					done();
				}, null);
			});
		}
	});
});