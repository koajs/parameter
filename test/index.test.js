/*!
 * koa-parameter - test/index.test.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

const util = require('util');
const bodyparser = require('koa-bodyparser');
const request = require('supertest');
const parameter = require('..');
const Koa = require('koa');

describe('koa-paramter', function () {
  it('should verify query ok', function (done) {
    const app = new Koa();
    app.use(bodyparser());
    app.use(parameter(app));
    app.use(async function (ctx) {
      ctx.verifyParams({
        id: 'id',
        name: 'string'
      });
      ctx.body = 'passed';
    });

    request(app.listen())
    .get('/?id=1&name=foo')
    .expect(200)
    .expect('passed', done);
  });

  it('should verify query error', function (done) {
    const app = new Koa();
    app.use(parameter(app));
    app.use(bodyparser());
    app.use(async function (ctx) {
      ctx.verifyParams({
        id: 'id',
        name: 'string'
      });
      ctx.body = 'passed';
    });

    request(app.listen())
    .get('/?id=x&name=foo')
    .expect(422)
    .expect({
      message: 'Validation Failed',
      errors: [{
        field: 'id',
        message: 'should match /^\\d+$/',
        code: 'invalid'
      }],
      params: { id: 'x', name: 'foo' }
    }, done);
  });

  it('should verify body ok', function (done) {
    const app = new Koa();
    app.use(bodyparser());
    app.use(parameter(app));
    app.use(async function (ctx) {
      ctx.verifyParams({
        id: 'id',
        name: 'string'
      });
      ctx.body = 'passed';
    });

    request(app.listen())
    .post('/?id=1&name=foo')
    .send({
      id: '1',
      name: 'foo'
    })
    .expect(200)
    .expect('passed', done);
  });

  it('should verify body error', function (done) {
    const app = new Koa();
    app.use(bodyparser());
    app.use(parameter(app));
    app.use(async function (ctx) {
      ctx.verifyParams({
        id: 'id',
        name: 'string'
      });
      ctx.body = 'passed';
    });

    request(app.listen())
    .post('/?id=x&name=foo')
    .send({
      id: 'xx',
      name: 'foo'
    })
    .expect(422)
    .expect({
      message: 'Validation Failed',
      errors: [{
        field: 'id',
        message: 'should match /^\\d+$/',
        code: 'invalid'
      }],
      params: { id: 'xx', name: 'foo' }
    }, done);
  });

  it('should ignore other error', function (done) {
    const app = new Koa();
    app.use(bodyparser());
    app.use(parameter(app));
    app.use(async function (ctx) {
      ctx.verifyParams({
        id: 'id',
        name: 'string'
      });
      ctx.body = 'passed';
      ctx.throw('throw error');
    });

    request(app.listen())
    .post('/?id=1&name=foo')
    .send({
      id: '1',
      name: 'foo'
    })
    .expect(500)
    .expect('Internal Server Error', done);
  });

  it('should ignore without rule', function (done) {
    const app = new Koa();
    app.use(bodyparser());
    app.use(parameter(app));
    app.use(async function (ctx) {
      ctx.verifyParams();
      ctx.body = 'passed';
    });

    request(app.listen())
    .post('/?id=1&name=foo')
    .send({
      id: '1',
      name: 'foo'
    })
    .expect(200)
    .expect('passed', done);
  });

  it('should not add middleware', function (done) {
    const app = new Koa();
    parameter(app);
    app.use(async function (ctx) {
      ctx.verifyParams({
        id: 'id',
        name: 'string'
      });
      ctx.body = 'passed';
    });

    request(app.listen())
    .get('/?id=x&name=foo')
    .expect(422)
    .expect('Validation Failed', done);
  });

  it('should verify input params', function (done) {
    const app = new Koa();
    parameter(app);
    app.use(async function (ctx) {
      const params = {
        id: 'x',
        name: 'foo'
      };
      const rule = {
        id: 'id',
        name: 'string'
      };

      ctx.verifyParams(rule, params);
      ctx.body = 'passed';
    });

    request(app.listen())
    .get('/')
    .expect(422)
    .expect('Validation Failed', done);
  });

  it('should translate error message', function (done) {
    const app = new Koa();
    app.use(parameter(app, function() {
      var args = Array.prototype.slice.call(arguments);
      args[0] = args[0].replace('should match %s', 'doit correspondre à %s');
      return util.format.apply(util, args);
    }));
    app.use(async function (ctx) {
      const params = {
        id: 'hi im not an id',
      };
      const rule = {
        id: 'id'
      };

      ctx.verifyParams(rule, params);
      ctx.body = 'passed';
    });

    request(app.listen())
    .get('/')
    .expect(422)
    .expect({
      message: 'Validation Failed',
      errors: [{
        field: 'id',
        message: 'doit correspondre à /^\\d+$/',
        code: 'invalid'
      }],
      params: { id: 'hi im not an id' }
    }, done);
  });
});
