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
			suich.getIPAddresses('foofoofoo.com', function(err, res) {
				assert.ifError(res);
				done();
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

	describe('isAddressLocal() method', function() {
		it('should return true', function() {
			suich.isAddressLocal('127.0.0.1', function(err, res) {
				assert.equal(res, true);
			});
		});
		it('should return false', function() {
			suich.isAddressLocal('128.30.52.45', function(err, res) {
				assert.equal(res, false);
			});
		});
		it('should return true', function() {
			assert.equal(suich.isAddressLocal('127.0.0.1'), true);
		});
		it('should return false', function() {
			assert.equal(suich.isAddressLocal('128.30.52.45'), false);
		});
	});

});