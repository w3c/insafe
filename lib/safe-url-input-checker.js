/*
 * Safe-Url-Input-CHecker  (suichJS) - Common security checks for remote resources
 * sent by an input url.
 * <https://github.com/w3c/safe-url-input-checker>
 *
 * Copyright Â© 2013 World Wide Web Consortium, (Massachusetts Institute
 * of Technology, European Research Consortium for Informatics and
 * Mathematics, Keio University, Beihang). All Rights Reserved. This
 * work is distributed under the W3CÂ® Software License [1] in the hope
 * that it will be useful, but WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.
 *
 * [1] http://www.w3.org/Consortium/Legal/2002/copyright-software-20021231
 *
 * Written September 2014 by Guillaume Baudusseau <guillaume@w3.org>
 * This module depends on :
 * ip : <https://github.com/indutny/node-ip>
 * Q : <https://github.com/kriskowal/q>
 */

/*
 * Dependencies
 */
var checker = exports,
	urlparser = require('url'),
	dns = require('dns'),
	ip = require('ip'),
	Q = require('q');

/*
 * Get all addresses linked to an hostname.
 * If callback : return err or an array which contain all IP addresses via callback.
 * If no callback : return Q promise.
 */
checker.getIPAddresses = function(host, cb) {
	if (cb) {
		dns.resolve(host, function(err, addrs) {
			if (err) cb(err);
			else cb(null, addrs);
		});
	} else {
		var deferred = Q.defer();
		dns.resolve(data.host, function(err, addrs) {
			if (err) deferred.resolve(err);
			else deferred.resolve(addrs);
		});
		return deferred.promise;
	}
};

/*
 * Check if an IP address is local.
 * If callback : return err or true/false via callback.
 * If no callback : return true/false.
 */
checker.isAddressLocal = function(addr, cb) {
	if (cb) {
		if (ip.isPrivate(addr) || ip.isLoopback(addr)) cb(null, true);
		else cb(null, false);
	} else {
		if (ip.isPrivate(addr) || ip.isLoopback(addr)) return true;
		else return false;
	}
};

/*
 * Check if an IP address is local.
 * Return err or true/false via callback.
 */
checker.isHostLocal = function(host, cb) {
	var self = this;
	if (!cb) {
		cb('error : no callback');
	} else {
		this.getIPAddresses(host, function(err, res) {
			if (err) cb(err);
			else {
				for (var index in res) {
					if (self.isAddressLocal(res[index])) {
						cb(null, true);
						return;
					}
					if (index == res.length - 1 && !self.isAddressLocal(res[index])) {
						cb(null, false);
						return;
					}
				}
			}
		});
	}
};

/*
 * Check if an host is blacklisted.
 * If callback : return err or true/false via callback.
 * If no callback : return true/false.
 */
checker.isHostBlacklisted = function(host, blacklist, cb) {
	if (!blacklist) blacklist = [];
	if (cb) {
		if (blacklist.indexOf(host) == -1) {
			cb(null, false);
		} else {
			cb(null, true);
		}
	} else {
		if (blacklist.indexOf(host) == -1) {
			return false;
		} else {
			return true;
		}
	}
};

/*
 * Check if protocol is acceptable. Compare with a list (protocolScheme) passed in parameters.
 * By default protocolScheme : http, https.
 * If callback : return err or true/false via callback.
 * If no callback : return true/false.
 */
checker.isProtocolAcceptable = function(protocol, protocolScheme, cb) {
	if (!protocolScheme) protocolScheme = ['http', 'https'];
	if (cb) {
		if (protocolScheme.indexOf(protocol) == -1) {
			cb(null, false);
		} else {
			cb(null, true);
		}
	} else {
		if (protocolScheme.indexOf(protocol) == -1) {
			return false;
		} else {
			return true;
		}
	}
};

/*
 * Resolve the URL passed without protocol and return a parsed URL object.
 * If callback : return err or url object via callback.
 * If no callback : return true/false.
 */
checker.resolveAndParseUrl = function(url, cb) {
	if (cb) {
		if (!urlparser.parse(url).host) {
			url = 'http://' + url;
		}
		cb(null, urlparser.parse(url));
	} else {
		if (!urlparser.parse(url).host) {
			url = 'http://' + url;
		}
		return urlparser.parse(url);
	}
};

/*
 * Run check isHostBlacklisted, isProtocolAcceptable, isHostLocal
 * return err if it occurred, true if url is safe and else return false via callback.
 */
checker.checkUrlSafety = function(url, cb, options) {
	var urlObj = this.resolveAndParseUrl(url);
	if (!options) {
		options = {};
	}
	if (!options.blacklist) options.blacklist = [];
	if (!options.protocolScheme) options.protocolScheme = ['http', 'https'];
	if (!this.isProtocolAcceptable(urlObj.protocol.split(':')[0], options.protocolScheme)) {
		cb(null, false);
		return;
	}
	if (this.isHostBlacklisted(urlObj.hostname, options.blacklist, null)) {
		cb(null, false);
		return;
	}
	this.isHostLocal(urlObj.hostname, function(err, res) {
		if (err) cb(err);
		if (res == true) cb(null, false);
		else cb(null, true);
	});
	return;
};