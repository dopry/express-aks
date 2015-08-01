/**
 * Module Dependencies
 */

var util = require('util');
var express = require('express');
var MemoryDB = require('express-aks-driver-memory');

/**
 * Initalize the Key Server
 * @param {Object} options Options for the AKS instance
 */
function AKS(options) {
	options = util._extend({
		trustProxy: false,
		db: new MemoryDB(),
	}, options);


	var version = this.version = 1;
	var app = express();

	if (options.trustProxy) {
		app.enable('trust proxy');
	}

	function handleError(err, req, res) {
		if (err === 'email malformed') {
			res.status(400);
			res.end(err);
		}
		else {
			res.status(500);
			res.end(err);
		}
	}

	app.get('/', function(req, res) {
		// Index of all keys is unsupported
		// 1) it could be a heavy request.
		// 2) it exposes a lot of user information to spammers.
		httpError('unsupported', res);
		return;
	});

	app.get('/:email', function(req, res) {
		// retrieve the key associated with this email address
		options.db.findOne(req.params.email, function(err, key) {
			if (err) {
				handleError(err, req, res);
				return;
			}
			res.setHeader('Content-Type', 'application/pgp-keys'); // as described in RFC-3156 (http://tools.ietf.org/html/rfc3156)
			res.status(200);
			res.end(key.keytext);
		});
	});

	app.post('/:email', function(req, res) {
		options.db.add(req.params.email, req.body, function(err, key) {
			if (err) {
				handleError(err, req, res);
				return;
			}
			res.setHeader('Content-Type', 'application/pgp-keys'); // as described in RFC-3156 (http://tools.ietf.org/html/rfc3156)
			res.status(200);
			res.end(key.keytext);
		});
	});

	return app;
}

module.exports = AKS;