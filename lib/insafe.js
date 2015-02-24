require('when/es6-shim/Promise');

var urlParser = require('url');
var ip = require('ip');
var dns = require('dns');
var http = require('http');
var https = require('https');

function checkHTTP(url, options) {
    if(!options) {
        var options = {};
    }
    if(!options.allowedHTTPResponse) {
        options.allowedHTTPResponse = [];
    }
    return new Promise(function(resolve, reject) {
        switch(urlParser.parse(url).protocol) {
            case 'http:':
                http.get({
                    host: urlParser.parse(url).host,
                    agent: false,
                    headers: {'user-agent': 'Mozilla/5.0'}
                }, function(res) {  
                    if(res.statusCode < 399 || options.allowedHTTPResponse.indexOf(res.statusCode)) {
                        resolve(true);
                    }
                    else {
                        reject(false);
                    }
                });
            break;
            case 'https:':
                https.get({
                    host: urlParser.parse(url).host,
                    agent: false,
                    headers: {'user-agent': 'Mozilla/5.0'}
                }, function(res) {
                    if(res.statusCode < 399 || options.allowedHTTPResponse.indexOf(res.statusCode)) {
                        resolve(true);
                    }
                    else {
                        reject(false);
                    }
                });
            break;
            default:
                reject(false);
            break;
        }
    }).catch(function(err){
        console.log(err);
        throw false;
    });
}

function checkDNS(host) {
    var myip = null;
    var ips = null;
    return new Promise(function(resolve, reject) {
        dns.resolve(host, function(err, addrs){
            if(err) {
                reject(err);
            } else {
                ips = addrs;
                resolve(true);
            }
        });
    }).catch(function(err){
        console.log(err);
        throw false;
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