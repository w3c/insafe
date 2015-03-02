![insafe by the World Wide Web Consortium](https://github.com/w3c/insafe/blob/master/public/insafe-logo.png)

Insafe is a Nodejs library which resolve and check the safety of an url.

# Features

- **Resolve url**: `w3.org` -> `http://w3.org`
- **DNS check**
- **HTTP/HTTPS check** (customizable)
- **Host blacklist**
- **Host whitelist**

# Install

available on npm soon.

# How it work?

Insafe is a JavaScript promises based API.

````javascript
var insafe = require('./lib/insafe');

insafe.check({
    url: 'example.com',
}).then(function(res) {
	console.log(res); // return true if safe, else return a promise error
});
```

Several options are available to check the url:

- **url** (required)
- **statusCodesAccepted**: tab of HTTP/HTTPS status codes accepted. see [default config](https://github.com/w3c/insafe/blob/master/lib/insafe.js).
- **statusCodesRefused**: tab of HTTP/HTTPS status codes refused see[default config](https://github.com/w3c/insafe/blob/master/lib/insafe.js).
- **blacklist**: tab of blacklisted host
- **whitelist**: tab of whitelisted host

````javascript
var insafe = require('./lib/insafe');

insafe.check({
    url: 'http://www.w3.org/',
    statusCodesAccepted: ["404"],
    statusCodesRefused: ["301", "203"],
    blacklist: [''],
    whitelist: ['www.w3.org', 'example.com']
}).then(function(res) {
	console.log(res); // return true if safe, else return a promise error
});
```


