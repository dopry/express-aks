var assert = require('assert');
var superagent = require('superagent');
var http = require('http');
var Express = require('express');
var AKS = require('..');

var testMalformedEmails = ['bademail' ];
var testMalformedKeys = [ '....' ];
var testGoodEmails = [ 'user1@example.com', 'user2+vrrp@example.com' ];
var testGoodKeys = [
    "-----BEGIN PGP PUBLIC KEY BLOCK-----\n"+
    "Version: BCPG C# v1.6.1.0\n" +
    "\n" +
    "mQENBFW7/+QBCACD/26MUOC2noyMHonHOJRfC/ANV2rWJ/waX5KgDSSaDLAKgIVF\n" +
    "tXk/nNLgn5gF9br0DNgX5gWkcU9Q7+QdmS2YAUJFdfX8FB06w3qLmqpLLKjtsSYz\n" +
    "iRfKw6PNzUBTgCJrC3zPlQJhFZCsQ/EZvSxeersgc+5dkRWsM0aSI556xekPsUNg\n" +
    "HqZP7fw1mr2pdXYDEcU4UYktEJnE+dEjmTLXo6QiGCLofg4Nc9AOZBGcJY8+GvDZ\n" +
    "IUQm+KIFprlZaiP3rin3a6XFiNq6MpAhk0/u6+R8X/UglB/VVsLq73O4mTWWQS9o\n" +
    "jwMdEA+CcExwtpQXhWWi9wu8i0lilp0LsYw9ABEBAAG0EXVzZXIxQGV4YW1wbGUu\n" +
    "Y29tiQEcBBABAgAGBQJVu//kAAoJEKPW17gPKkltto8H/3HwqkuieDrSb4wwyMCX\n" +
    "A4ZH5YC77lFWpWl0yCEe/91uM8z944c86nyCb60XdrJvL8KCV96S3MnYPKILIR7e\n" +
    "Aj2/CDHH9+LDsu7M4yaDD1MSEId1NXX8/At7GDKHclbu1eVnFdOhBtx4G95c2DzB\n" +
    "pQxKm1QEAlTkAb6jWN3R8nf2IgvARDcP/Vz3oeFx8/H5yx/UNJv0QpbWsq+tUH9F\n" +
    "TiGc05zVfoBpHFoq1nFTOn1G/Wm5xl8LG7sVkaxY5pTtMp7vaxvdEr6DMLB71DrC\n" +
    "F9P69AlIhY0S87re5H82eph/xkIuVsCVaaQJtCvwta5wrBcYoeqeWJIbsZCAnK4+\n" +
    "okY=\n" +
    "=nrQ4\n" +
    "-----END PGP PUBLIC KEY BLOCK-----"
];

describe('Authorative Key Server: Stand-Alone', function() {
    var server;


    before(function(done) {
        var app = new AKS();
        server = app.listen(3000, function(err, res) {
            done();
        });
    });

    after(function() {
        server.close();
    });

    var baseUrl = 'http://localhost:3000/';
    test(baseUrl);
});

describe('Authorative Key Server: Composed', function() {
    var server;


    before(function() {
        var keyserver = new AKS();
        var app = new Express();
        app.use('/keyserver', keyserver);
        server = app.listen(3010);
    });

    after(function() {
        server.close();
    });

    var baseUrl = 'http://localhost:3010/keyserver/';
    test(baseUrl);
});


function test(baseUrl) {

    describe("Add Key", function() {
        it("should return 400 malfomed email when posting to an invalid email address", function(done) {
            testMalformedEmails.forEach(function(email) {
                var postUrl = baseUrl + email;
                superagent
                .post(postUrl)
                .send(testGoodKeys[0])
                .end(function(err, res){
                    assert.equal(res.status, 400);
                    assert.equal(res.text, 'email malformed');
                    done();
                });
            });
        });
    });

}
