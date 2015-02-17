require('when/es6-shim/Promise');

var urlParser = require('url');
var ip = require('ip');
var dns = require('dns');
var http = require('http');

function checkHTTP(url) {
    return new Promise(function(resolve, reject) {
        var options = urlParser.parse(url);
        options.agent = false;
        http.get(options, function(res) {
            resolve(true);
            console.log(res.statusCode);
        });
    });
}

function checkDNS(host) {
    var myip = null;
    var ips = null;
    return new Promise(function(resolve, reject) {
        dns.resolve(host, function(err, addrs){
            if(err) {
                console.log("rejet");
                reject(err);
            } else {
                ips = addrs;
                resolve(true);
            }
        });
    }).catch(function(){
        return false;
    });
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
    }).then(function() {
        return checkHTTP(url);
    }).catch(function() {
        return false;
    });
}