koa-parameter
---------------

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![Gittip][gittip-image]][gittip-url]

[npm-image]: https://img.shields.io/npm/v/koa-parameter.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-parameter
[travis-image]: https://img.shields.io/travis/koajs/parameter.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/parameter
[coveralls-image]: https://img.shields.io/coveralls/koajs/parameter.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koajs/parameter?branch=master
[david-image]: https://img.shields.io/david/koajs/parameter.svg?style=flat-square
[david-url]: https://david-dm.org/koajs/parameter
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[gittip-image]: https://img.shields.io/gittip/dead-horse.svg?style=flat-square
[gittip-url]: https://www.gittip.com/dead-horse/

parameter validate middleware for koa, powered by [parameter](https://github.com/node-modules/parameter).

## Installation

```bash
$ npm install koa-parameter --save
```

## Usage

```js
var koa = require('koa');
var parameter = require('koa-parameter');

parameter(app); // add verifyParams method, but don't add middleware to catch the error
// app.use(parameter(app)); // also add a middleware to catch the error.

app.use(function* () {
  this.verifyParams({
    name: 'string'
  });
});
```

Checkout [parameter](https://github.com/node-modules/parameter) to get all the rules.

## Translate 

You can override the translate method of parameter to implement I18n, by passing a function like this :

```js
var koa = require('koa');
var parameter = require('koa-parameter');

parameter(app, function() {
  // Same example with node-parameter
  var args = Array.prototype.slice.call(arguments);
  // Assume there have I18n.t method for convert language.
  return I18n.t.apply(I18n, args);
});

app.use(function* () {
  this.verifyParams({
    name: 'string'
  });
});
```

## [Example](example/index.js)

### License

MIT
