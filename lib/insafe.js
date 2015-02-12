// check si vide ou non
// resolve and parse
// check si dns error
// check si http error
// optional checks

var url = require('url');
var ip = require('ip');
var dns = require('dns');
var when = require('when');
var nodefn = require('when/node');
var es6ShimPromise = require('when/es6-shim/Promise');

/*function isEmpty(uri) {
	return new Promise(function(resolve, reject){
    	if (uri.length === 0)
        	resolve(true);
    	else
        	resolve(false);

	});
}*/

var resolveAddress = nodefn.lift(dns.resolve);

/*function getIPs(host) {
	var deferred = when.defer();
	var promise = deferred.promise;
	dns.resolve(host, function(err, addrs) {
		if (err) deferred.resolve(err);
		else deferred.resolve(addrs);
	});
	return promise;
}*/

function getIPs(host) {
	return new Promise(function(resolve, reject){
 		dns.resolve(host, function(err, addrs){
 			if (err) reject(err);
 			else resolve(addrs);
 		});
	});
}

function isIPLocal(addr) {

}

function isHostLocal(host) {
    return resolveAddress(host)
        .then(function(res) {
            co
        })
        .catch(function(reason) {
            console.log(reason);
        });
}

exports.check = function(uri, conf) {
    return new Promise(function(resolve, reject) {
    	// check if uri is not empty
    	if(uri) {
    		resolve(true);
    	}
    	else {
    		reject(false);
    	}
    }).then(function(res) {
    	// if uri has a protocol 
        console.log(res);
    	if(url.parse(uri).protocol) {
    		return true;
    	}
    	// else give it by default the http protocol
    	else {
			uri = 'http://' + uri;
			return true;
    	}
    }).then(function(res){
    	return getIPs(url.parse(uri).host);
    }).then(function(addrs){
        return addrs;
    });

    /*if(uri) {
		if(!url.parse(uri).protocol)
			uri = 'http://' + uri;
		if(!url.parse(uri).host)
			return false;
		if(isHostLocal(url.parse(uri).host))
			return false;
		return true;
	}
	else {
		return false;
	}*/
}