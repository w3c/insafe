var checker = exports,
	urlparser = require('url'),
	dns = require('dns'),
	ip = require('ip'),
	Q = require('q');

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

checker.isAddressLocal = function(addr, cb) {
	if (cb) {
		if (ip.isPrivate(addr) || ip.isLoopback(addr)) cb(null, true);
		else cb(null, false);
	} else {
		if (ip.isPrivate(addr) || ip.isLoopback(addr)) return true;
		else return false;
	}
};

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

checker.isHostBlacklisted = function(host, cb, blacklist) {
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

/*checker.isPortAcceptable = function(port, portScheme, cb) {
	if (!portScheme) portScheme = [null];
	if (cb) {
		if (portScheme.indexOf(port) == -1) {
			cb(null, false);
		} else {
			cb(null, true);
		}
	} else {
		if (portScheme.indexOf(port) == -1) {
			return false;
		} else {
			return true;
		}
	}
};*/

checker.resolveAndParseUrl = function(url, cb) {
	if (cb) {
		if (!urlparser.parse(url).host) {
			url = 'http://' + url;
		}
		cb(urlparser.parse(url));
	} else {
		if (!urlparser.parse(url).host) {
			url = 'http://' + url;
		}
		return urlparser.parse(url);
	}
};

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
	if (this.isHostBlacklisted(urlObj.hostname, null, options.blacklist)) {
		cb(null, false);
		return;
	}
	this.isHostLocal(urlObj.hostname, function (err, res) {
		if(err) cb(err);
		if(res == true) cb(null, false);
		else cb(null, true);
	});
	return;
};