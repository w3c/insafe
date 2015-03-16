require('when/es6-shim/Promise');
var insafe = require('../lib/insafe');

insafe.check({
	url: 'http://w3.org'
}).then(function(res){
	console.log(res);
}).catch(function(err){
	console.log(err);
});