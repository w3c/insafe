var suich = require('..'),
	assert = require('assert'),
	Q = require('q');

describe('safe url input checker library for node.js', function() {

	describe('getIPAddresses() method', function() {
		it('should get IP addresses', function(done) {
			suich.getIPAddresses('w3.org', function(err, res) {
				assert.equal(res, "128.30.52.45");
				done();
			});
		});
		it('should get IP addresses', function(done) {
			suich.getIPAddresses('localhost', function(err, res) {
				assert.equal(res, "127.0.0.1");
				done();
			});
		});
		it('should not get IP addresses', function(done) {
			suich.getIPAddresses('foofoofoofoofoo.com', function(err, res) {
				assert.ifError(res);
				done();
			});
		});
	});


	describe('isHostBlacklisted() method', function() {
		it('should return true', function() {
			suich.isHostBlacklisted('google.com', ['google.com', 'pinpin.com'], function(err, res) {
				assert.equal(res, true);
			});
		});
	});


});