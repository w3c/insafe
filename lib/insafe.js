require('when/es6-shim/Promise');

var urlParser = require('url');
var dns = require('dns');
var http = require('http');
var https = require('https');

var statusCodesHTTP = {
    '100': {
        status: true,
        description: ''
    },
    '101': {
        status: true,
        description: ''
    },
    '102': {
        status: true,
        description: ''
    },
    '200': {
        status: true,
        description: ''
    },
    '201': {
        status: true,
        description: ''
    },
    '202': {
        status: true,
        description: ''
    },
    '203': {
        status: true,
        description: ''
    },
    '204': {
        status: true,
        description: ''
    },
    '205': {
        status: true,
        description: ''
    },
    '206': {
        status: true,
        description: ''
    },
    '207': {
        status: true,
        description: ''
    },
    '208': {
        status: true,
        description: ''
    },
    '226': {
        status: true,
        description: ''
    },
    '300': {
        status: true,
        description: ''
    },
    '301': {
        status: true,
        description: ''
    },
    '302': {
        status: true,
        description: ''
    },
    '303': {
        status: true,
        description: ''
    },
    '304': {
        status: true,
        description: ''
    },
    '305': {
        status: true,
        description: ''
    },
    '306': {
        status: true,
        description: ''
    },
    '307': {
        status: true,
        description: ''
    },
    '308': {
        status: true,
        description: ''
    },
    '400': {
        status: false,
        description: ''
    },
    '401': {
        status: false,
        description: ''
    },
    '402': {
        status: false,
        description: ''
    },
    '403': {
        status: false,
        description: ''
    },
    '404': {
        status: false,
        description: ''
    },
    '405': {
        status: false,
        description: ''
    },
    '406': {
        status: false,
        description: ''
    },
    '407': {
        status: false,
        description: ''
    },
    '408': {
        status: false,
        description: ''
    },
    '409': {
        status: false,
        description: ''
    },
    '410': {
        status: false,
        description: ''
    },
    '411': {
        status: false,
        description: ''
    },
    '412': {
        status: false,
        description: ''
    },
    '413': {
        status: false,
        description: ''
    },
    '414': {
        status: false,
        description: ''
    },
    '415': {
        status: false,
        description: ''
    },
    '416': {
        status: false,
        description: ''
    },
    '417': {
        status: false,
        description: ''
    },
    '421': {
        status: false,
        description: ''
    },
    '422': {
        status: false,
        description: ''
    },
    '423': {
        status: false,
        description: ''
    },
    '424': {
        status: false,
        description: ''
    },
    '425': {
        status: false,
        description: ''
    },
    '426': {
        status: false,
        description: ''
    },
    '427': {
        status: false,
        description: ''
    },
    '428': {
        status: false,
        description: ''
    },
    '429': {
        status: false,
        description: ''
    },
    '430': {
        status: false,
        description: ''
    },
    '431': {
        status: false,
        description: ''
    },
    '501': {
        status: false,
        description: ''
    },
    '502': {
        status: false,
        description: ''
    },
    '503': {
        status: false,
        description: ''
    },
    '504': {
        status: false,
        description: ''
    },
    '505': {
        status: false,
        description: ''
    },
    '506': {
        status: false,
        description: ''
    },
    '507': {
        status: false,
        description: ''
    },
    '508': {
        status: false,
        description: ''
    },
    '509': {
        status: false,
        description: ''
    },
    '510': {
        status: false,
        description: ''
    },
    '511': {
        status: false,
        description: ''
    }
};

function checkHTTP(url, options) {
    if(!options) {
        var options = {};
    }
    if(!options.allowedHTTPResponse) {
        options.allowedHTTPResponse = [];
    }
    return new Promise(function(resolve, reject) {
        console.log(urlParser.parse(url));
        switch(urlParser.parse(url).protocol) {
            case 'http:':
                http.get({
                    host: urlParser.parse(url).host,
                    hostname: urlParser.parse(url).hostname,
                    port: urlParser.parse(url).port,
                    path: urlParser.parse(url).path,
                    agent: false,
                    headers: {'user-agent': 'Mozilla/5.0'}
                }, function(res) {
                    if(statusCodesHTTP[res.statusCode.toString()].status == true) {
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
                    hostname: urlParser.parse(url).hostname,
                    port: urlParser.parse(url).port,
                    path: urlParser.parse(url).path,
                    agent: false,
                    headers: {'user-agent': 'Mozilla/5.0'}
                }, function(res) {
                    if(statusCodesHTTP[res.statusCode.toString()].status == true) {
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