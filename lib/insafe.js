require('when/es6-shim/Promise');

var urlParser = require('url');
var ip = require('ip');
var dns = require('dns');

function checkHTTP() {

}

function checkDNS(url) {
    var ips = null;
    return new Promise(function(resolve, reject) {
        dns.resolve(urlParser.parse(url).host, function(err, addrs){
            if(err) {
                reject(err);
            } else {
                ips = addrs;
                resolve(true);
            }
        });
    }).then(function(addrs) {
        console.log(res);
        console.log(ips);
        return true;
    }).catch();
}

exports.check = function(options) {
    var url = options.url;
    return new Promise(function(resolve, reject) {
        if(url) {
            resolve(true);
        } else {
            reject(false);
        }
    }).then(function() {
        if(urlParser.parse(url).protocol) {
            return true;
        } else {
            url = 'http://' + url;
            return true;
        }
    }).then(function() {
        return checkDNS(urlParser.parse(url).host);
    });
}