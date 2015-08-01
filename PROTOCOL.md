# Public Key Registry Protocol


## Status of this memo

This is not yet an official Internet-Draft.

## Abstract

This document specifies a protocol for the publishing, discovery, and sharing of GPG Public Keys.

## Table of Contents

1. [Status of this Memo](#status-of-this-memo)
2. [Abstract](#abstract)
3. [Table of Contents](#table-of-contents)
4. [Introduction](#introduction)
5. [Discovery](#discovery)
5. [Transactions](#transactions)
5. [REST API](#rest-api)

Introduction
------------

The Public Key Registry (PKR) Protocol is a proposal for a RESTful Pubilc Key discovery protocol. The protocol is inspired by Trey Griffith's [HTTP Authoritative Keyserver Protocol](https://github.com/treygriffith/aks/wiki/Protocol). This proposal goes farther in completely ignoring legacy issues related to HKP.

PKR treats email addresses as a identity to which GPG Public Keys are related. DNS SRV record are used to identify authoritative PKR servers. All key transactions are handled via a simple REST API.

Discovery
---------

Domain administrators can specify trusted keyservers using DNS SRV records as follows.

```
  _pkr._tcp.exmaple.com 86400 IN SRV 0 5 443 keys.example.com
```

Transactions
------------
1. Adding a Key
2. Verifying a Key
3. Revoking a Key
4. Fetching an email's Key
5. Fetching PKR Servers's



REST API
----------------------------

The generic  BASE URI schema is {keytype}/{service}. For this case we are using gpg/email. The idea is that in the
future it could be expanded to openssh/ssh, openssl/https, openssl/tls for publishing differentl types of public keys relevant to your domain. keytypes could be x.509, openssl, openssh, opengpg, etc.


POST /keys
Initiate the publishing of a new key.

The post body should be a JSON object with an email address and a key. Upon posting the key will be validated with any applicable signing authorities, then a one time authorizatione email or error messages will be sent to the email address the key is being published for. It shall be encrypted with the new private key, and signed with the Key servers private key.

*Request Body*
```javascript
{
   email: '', // use @domain.com to store domain level keys, such as internal CA certs.
   key: '',
}
```

The response will contain a requestid which is an SHA1 hash of the posted key.

*Response Body*
{
    requestid: 'XXXXXXXX'
}


POST /keys/verify/{requestid}

User will need to authorize posted keys after email validation.

*Request Body*
```javascript
{
    token: {on time token}
}
```

GET /keys

Will return the PKR Server's public keys and revokation list.

GET /keys/:sha1(email)

To help prevent leakage of meta data keys are fetched using the SHA1 has of the complete email address.

*Response Body*

The response body will contain a list of active and revoked keys.
```
{
    active: [
        "-----BEGIN PGP PUBLIC KEY BLOCK----
        Version: BCPG C# v1.6.1.0

        mQENBFW7/+QBCACD/26MUOC2noyMHonHOJRfC/ANV2rWJ/waX5KgDSSaDLAKgIVF
        tXk/nNLgn5gF9br0DNgX5gWkcU9Q7+QdmS2YAUJFdfX8FB06w3qLmqpLLKjtsSYz
        iRfKw6PNzUBTgCJrC3zPlQJhFZCsQ/EZvSxeersgc+5dkRWsM0aSI556xekPsUNg
        HqZP7fw1mr2pdXYDEcU4UYktEJnE+dEjmTLXo6QiGCLofg4Nc9AOZBGcJY8+GvDZ
        IUQm+KIFprlZaiP3rin3a6XFiNq6MpAhk0/u6+R8X/UglB/VVsLq73O4mTWWQS9o
        jwMdEA+CcExwtpQXhWWi9wu8i0lilp0LsYw9ABEBAAG0EXVzZXIxQGV4YW1wbGUu
        Y29tiQEcBBABAgAGBQJVu//kAAoJEKPW17gPKkltto8H/3HwqkuieDrSb4wwyMCX
        A4ZH5YC77lFWpWl0yCEe/91uM8z944c86nyCb60XdrJvL8KCV96S3MnYPKILIR7e
        Aj2/CDHH9+LDsu7M4yaDD1MSEId1NXX8/At7GDKHclbu1eVnFdOhBtx4G95c2DzB
        pQxKm1QEAlTkAb6jWN3R8nf2IgvARDcP/Vz3oeFx8/H5yx/UNJv0QpbWsq+tUH9F
        TiGc05zVfoBpHFoq1nFTOn1G/Wm5xl8LG7sVkaxY5pTtMp7vaxvdEr6DMLB71DrC
        F9P69AlIhY0S87re5H82eph/xkIuVsCVaaQJtCvwta5wrBcYoeqeWJIbsZCAnK4+
        okY=
        =nrQ4
        -----END PGP PUBLIC KEY BLOCK-----",
        "",
    ],
    revoked: [
        "-----BEGIN PGP PUBLIC KEY BLOCK----
        Version: BCPG C# v1.6.1.0

        mQENBFW7/+QBCACD/26MUOC2noyMHonHOJRfC/ANV2rWJ/waX5KgDSSaDLAKgIVF
        tXk/nNLgn5gF9br0DNgX5gWkcU9Q7+QdmS2YAUJFdfX8FB06w3qLmqpLLKjtsSYz
        iRfKw6PNzUBTgCJrC3zPlQJhFZCsQ/EZvSxeersgc+5dkRWsM0aSI556xekPsUNg
        HqZP7fw1mr2pdXYDEcU4UYktEJnE+dEjmTLXo6QiGCLofg4Nc9AOZBGcJY8+GvDZ
        IUQm+KIFprlZaiP3rin3a6XFiNq6MpAhk0/u6+R8X/UglB/VVsLq73O4mTWWQS9o
        jwMdEA+CcExwtpQXhWWi9wu8i0lilp0LsYw9ABEBAAG0EXVzZXIxQGV4YW1wbGUu
        Y29tiQEcBBABAgAGBQJVu//kAAoJEKPW17gPKkltto8H/3HwqkuieDrSb4wwyMCX
        A4ZH5YC77lFWpWl0yCEe/91uM8z944c86nyCb60XdrJvL8KCV96S3MnYPKILIR7e
        Aj2/CDHH9+LDsu7M4yaDD1MSEId1NXX8/At7GDKHclbu1eVnFdOhBtx4G95c2DzB
        pQxKm1QEAlTkAb6jWN3R8nf2IgvARDcP/Vz3oeFx8/H5yx/UNJv0QpbWsq+tUH9F
        TiGc05zVfoBpHFoq1nFTOn1G/Wm5xl8LG7sVkaxY5pTtMp7vaxvdEr6DMLB71DrC
        F9P69AlIhY0S87re5H82eph/xkIuVsCVaaQJtCvwta5wrBcYoeqeWJIbsZCAnK4+
        okY=
        =nrQ4
        -----END PGP PUBLIC KEY BLOCK-----",
        "",
    ]
}
```

POST /key/{sha1}/revoke
{
  key:  "-----BEGIN PGP PUBLIC KEY BLOCK----
        Version: BCPG C# v1.6.1.0

        mQENBFW7/+QBCACD/26MUOC2noyMHonHOJRfC/ANV2rWJ/waX5KgDSSaDLAKgIVF
        tXk/nNLgn5gF9br0DNgX5gWkcU9Q7+QdmS2YAUJFdfX8FB06w3qLmqpLLKjtsSYz
        iRfKw6PNzUBTgCJrC3zPlQJhFZCsQ/EZvSxeersgc+5dkRWsM0aSI556xekPsUNg
        HqZP7fw1mr2pdXYDEcU4UYktEJnE+dEjmTLXo6QiGCLofg4Nc9AOZBGcJY8+GvDZ
        IUQm+KIFprlZaiP3rin3a6XFiNq6MpAhk0/u6+R8X/UglB/VVsLq73O4mTWWQS9o
        jwMdEA+CcExwtpQXhWWi9wu8i0lilp0LsYw9ABEBAAG0EXVzZXIxQGV4YW1wbGUu
        Y29tiQEcBBABAgAGBQJVu//kAAoJEKPW17gPKkltto8H/3HwqkuieDrSb4wwyMCX
        A4ZH5YC77lFWpWl0yCEe/91uM8z944c86nyCb60XdrJvL8KCV96S3MnYPKILIR7e
        Aj2/CDHH9+LDsu7M4yaDD1MSEId1NXX8/At7GDKHclbu1eVnFdOhBtx4G95c2DzB
        pQxKm1QEAlTkAb6jWN3R8nf2IgvARDcP/Vz3oeFx8/H5yx/UNJv0QpbWsq+tUH9F
        TiGc05zVfoBpHFoq1nFTOn1G/Wm5xl8LG7sVkaxY5pTtMp7vaxvdEr6DMLB71DrC
        F9P69AlIhY0S87re5H82eph/xkIuVsCVaaQJtCvwta5wrBcYoeqeWJIbsZCAnK4+
        okY=
        =nrQ4
        -----END PGP PUBLIC KEY BLOCK-----"

}

