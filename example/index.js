/*!
 * koa-parameter - example/index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var bodyparser = require('koa-bodyparser');
var parameter = require('..');
var koa = require('koa');

var app = koa();

app.use(bodyparser());
app.use(parameter(app));

app.use(function* () {
  this.verifyParams({
    id: {isId: true},
    date: {isDate: true}
  });
  this.body = 'passed';
});

app.listen(3000);
