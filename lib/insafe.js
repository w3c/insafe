require('when/es6-shim/Promise');

var urlParser = require('url');
var dns = require('dns');
var http = require('http');
var https = require('https');

// http://www.iana.org/assignments/http-status-codes/http-status-codes.xml
var statusCodesHTTP = {
    '100': {
        status: true,
        description: 'Continue'
    },
    '101': {
        status: true,
        description: 'Switching Protocols'
    },
    '102': {
        status: true,
        description: 'Processing'
    },
    '200': {
        status: true,
        description: 'OK'
    },
    '201': {
        status: true,
        description: 'Created'
    },
    '202': {
        status: true,
        description: 'Accepted'
    },
    '203': {
        status: true,
        description: 'Non-Authoritative Information'
    },
    '204': {
        status: true,
        description: 'No Content'
    },
    '205': {
        status: true,
        description: 'Reset Content'
    },
    '206': {
        status: true,
        description: 'Partial Content'
    },
    '207': {
        status: true,
        description: 'Multi-Status'
    },
    '208': {
        status: true,
        description: 'Already Reported'
    },
    '226': {
        status: true,
        description: 'IM Used'
    },
    '300': {
        status: true,
        description: 'Multiple Choices'
    },
    '301': {
        status: false,
        description: 'Moved Permanently'
    },
    '302': {
        status: true,
        description: 'Found'
    },
    '303': {
        status: true,
        description: 'See Other'
    },
    '304': {
        status: true,
        description: 'Not Modified'
    },
    '305': {
        status: true,
        description: 'Use Proxy'
    },
    '307': {
        status: true,
        description: 'Temporary Redirect'
    },
    '308': {
        status: true,
        description: 'Permanent Redirect'
    },
    '400': {
        status: false,
        description: 'Bad Request'
    },
    '401': {
        status: false,
        description: 'Unauthorized'
    },
    '402': {
        status: false,
        description: 'Payment Required'
    },
    '403': {
        status: false,
        description: 'Forbidden'
    },
    '404': {
        status: false,
        description: 'Not Found'
    },
    '405': {
        status: false,
        description: 'Method Not Allowed'
    },
    '406': {
        status: false,
        description: 'Not Acceptable'
    },
    '407': {
        status: false,
        description: 'Proxy Authentication Required'
    },
    '408': {
        status: false,
        description: 'Request Timeout'
    },
    '409': {
        status: false,
        description: 'Conflict'
    },
    '410': {
        status: false,
        description: 'Gone'
    },
    '411': {
        status: false,
        description: 'Length Required'
    },
    '412': {
        status: false,
        description: 'Precondition Failed'
    },
    '413': {
        status: false,
        description: 'Payload Too Large'
    },
    '414': {
        status: false,
        description: 'URI Too Long'
    },
    '415': {
        status: false,
        description: 'Unsupported Media Type'
    },
    '416': {
        status: false,
        description: 'Range Not Satisfiable'
    },
    '417': {
        status: false,
        description: 'Expectation Failed'
    },
    '421': {
        status: false,
        description: 'Misdirected Request'
    },
    '422': {
        status: false,
        description: 'Unprocessable Entity'
    },
    '423': {
        status: false,
        description: 'Locked'
    },
    '424': {
        status: false,
        description: 'Failed Dependency'
    },
    '426': {
        status: false,
        description: 'Upgrade Required'
    },
    '428': {
        status: false,
        description: 'Precondition Required'
    },
    '429': {
        status: false,
        description: 'Too Many Requests'
    },
    '431': {
        status: false,
        description: 'Request Header Fields Too Large'
    },
    '500': {
        status: false,
        description: 'Internal Server Error'
    },
    '501': {
        status: false,
        description: 'Not Implemented'
    },
    '502': {
        status: false,
        description: 'Bad Gateway'
    },
    '503': {
        status: false,
        description: 'Service Unavailable'
    },
    '504': {
        status: false,
        description: 'Gateway Timeout'
    },
    '505': {
        status: false,
        description: 'HTTP Version Not Supported'
    },
    '506': {
        status: false,
        description: 'Variant Also Negotiates'
    },
    '507': {
        status: false,
        description: 'Insufficient Storage'
    },
    '508': {
        status: false,
        description: 'Loop Detected'
    },
    '510': {
        status: false,
        description: 'Not Extended'
    },
    '511': {
        status: false,
        description: 'Network Authentication Required'
    }
};

function checkHTTP(url, options) {
    if(options.statusCodesAccepted) {
        for(var i = 0; i < options.statusCodesAccepted.length; i++) {
            try {
                statusCodesHTTP[options.statusCodesAccepted[i].toString()].status = true;
            }
            catch(err) {

            }
        }
    }
    if(options.statusCodesRefused) {
        for(var i = 0; i < options.statusCodesRefused.length; i++) {
            try {
                statusCodesHTTP[options.statusCodesRefused[i].toString()].status = false;
            }
            catch(err) {

            }
        }
    }
    return new Promise(function(resolve, reject) {
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
                        reject('http status code refused: ' + res.statusCode);
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
                        reject('http status code refused: ' + res.statusCode);
                    }
                });
            break;
            default:
                reject(urlParser.parse(url).protocol + ' protocol not allowed');
            break;
        }
    }).catch(function(err){
        throw err;
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
        throw err;
    });
}

function checkSelfReferencing(url) {

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
        return checkHTTP(url, options);
    }).catch(function(err) {
        throw err;
    });
}