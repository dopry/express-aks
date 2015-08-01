express-aks
========================
`express-aks` is a restful GPG key server inspired by and derived from Trey Griffith's [HTTP Authoritative Keyserver Protocol](https://github.com/AuthoritativeKeyServerWG/aks/wiki/Protocol).

Installation
------------

```bash
$ npm install express-aks
```

Usage
-----

`express-aks` can be run as a stand-alone or composed into your existing express applications. To create it, simply create an instance of `aks` and instruct it to listen on the proper port.

*Stand-Alone*

```javascript
var AKS = require('express-aks');
var aks = new AKS();
aks.listen(); // defaults to HKP Port 11371.
```

*Composed*

```javascript
express = require('express');
var AKS = require('express-aks');
var aks = new AKS();
var app = new express();
// mount aks on /keyserver uri.
app.use('/keyserver', aks);
app.listen();
```

Options
-------

#### Server Options

The AKS server accepts an options object on contruction.
The possible properties for the options object are:

* `trustProxy` - If set to a truthy value, this tells AKS to trust a proxy which handles SSL connections by respecting the `X-Forwarded-Proto` header. [See the Express documentation of `trust proxy`](http://expressjs.com/api.html#app-settings) for more information. Defaults to false.

* `db` - an instance of a [database driver](#Key Database Drivers).

Key Database Drivers
--------------------

AKS is implemented such that it is agnostic to how keys are stored/retrieved and interacts with any storage mechanism through a driver that implements the methods required by express-aks

Available Database Drivers:

1. [express-aks-driver-base](http://github.com/dopry/express-aks-driver-base) - Implements common validation components that other drivers can chain off of.
1. [express-aks-driver-memory](http://github.com/dopry/express-aks-driver-memory) - Implements in memory storage with no persistence. It is useful for testing.
1. *TODO* [express-aks-driver-filesystem](http://github.com/dopry/express-aks-driver-filesystem) - Implements filesystem base storage. Useful on embedded platforms.
1. *TODO* [express-aks-driver-mongodb](http://github.com/dopry/express-aks-driver-mongodb) - Implements MongoDB based storage.
1. *TODO* [express-aks-driver-couchdb](http://github.com/dopry/express-aks-driver-couchdb) - Implements CouchDB based storage, useful where synchronization is needed.


Compliant Key Database Drivers implement the following methods:

* `findOne`
	The `findOne` method calls back with a single `key` object when supplied with a valid email address as the first parameter. The key object should have at least the following properties defined:
	* `keytext` - The Public Key Block
	* `uid` - The email address which uniquely identifies this key
	* `user` - Portion of the email address prior to the `@`
	* `domain` - The domain of the user (portion of the email address after the `@`)

* `find`
	The find method should take the `domain` as an optional first parameter. If supplied, it should call back with an array of keys corresponding to users of the specified `domain`. If `domain` is omitted, it should call back with an array of keys for all users on the keyserver. Each `key` object in the array should have at least the following properties defined:
	* `uid` - The email address which uniquely identifies this key
	* `user` - Portion of the email address prior to the `@`
	* `domain` - The domain of the user (portion of the email address after the `@`)

* `add`
	The `add` method should store a key object when supplied with an email address as the first parameter and the Public Key Block as the second parameter. This method is currently not implemented in the Public API, but is necessary for adding additional users to the key server.

Any of the currently available drivers can be forked and used as the basis of a new driver.
