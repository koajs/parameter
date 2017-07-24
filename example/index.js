/*!
 * koa-parameter - example/index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

const bodyparser = require('koa-bodyparser');
const parameter = require('..');
const Koa = require('koa');

const app = new Koa();

app.use(bodyparser());
app.use(parameter(app));

app.use(async function (ctx) {
  ctx.verifyParams({
    id: 'id',
    date: 'date'
  });
  ctx.body = 'passed';
});

app.listen(3000);
