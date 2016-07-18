/*!
 * koa-parameter - test/index.test.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var util = require('util');
var bodyparser = require('koa-bodyparser');
var request = require('supertest');
var parameter = require('..');
var koa = require('koa');

describe('koa-paramter', function () {
  it('should verify query ok', function (done) {
    var app = koa();
    app.use(parameter(app));
    app.use(function* () {
      this.verifyParams({
        id: 'id',
        name: 'string'
      });
      this.body = 'passed';
    });

    request(app.listen())
    .get('/?id=1&name=foo')
    .expect(200)
    .expect('passed', done);
  });

  it('should verify query error', function (done) {
    var app = koa();
    app.use(parameter(app));
    app.use(function* () {
      this.verifyParams({
        id: 'id',
        name: 'string'
      });
      this.body = 'passed';
    });

    request(app.listen())
    .get('/?id=x&name=foo')
    .expect(422)
    .expect({
      message: 'Validation Failed',
      errors: [{
        field: 'id',
        message: 'id should match /^\\d+$/',
        code: 'invalid'
      }],
      params: { id: 'x', name: 'foo' }
    }, done);
  });

  it('should verify body ok', function (done) {
    var app = koa();
    app.use(bodyparser());
    app.use(parameter(app));
    app.use(function* () {
      this.verifyParams({
        id: 'id',
        name: 'string'
      });
      this.body = 'passed';
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
    var app = koa();
    app.use(bodyparser());
    app.use(parameter(app));
    app.use(function* () {
      this.verifyParams({
        id: 'id',
        name: 'string'
      });
      this.body = 'passed';
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
        message: 'id should match /^\\d+$/',
        code: 'invalid'
      }],
      params: { id: 'xx', name: 'foo' }
    }, done);
  });

  it('should ignore other error', function (done) {
    var app = koa();
    app.use(bodyparser());
    app.use(parameter(app));
    app.use(function* () {
      this.verifyParams({
        id: 'id',
        name: 'string'
      });
      this.body = 'passed';
      this.throw('throw error');
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
    var app = koa();
    app.use(bodyparser());
    app.use(parameter(app));
    app.use(function* () {
      this.verifyParams();
      this.body = 'passed';
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
    var app = koa();
    parameter(app);
    app.use(function* () {
      this.verifyParams({
        id: 'id',
        name: 'string'
      });
      this.body = 'passed';
    });

    request(app.listen())
    .get('/?id=x&name=foo')
    .expect(422)
    .expect('Validation Failed', done);
  });

  it('should verify input params', function (done) {
    var app = koa();
    parameter(app);
    app.use(function* () {
      var params = {
        id: 'x',
        name: 'foo'
      };
      var rule = {
        id: 'id',
        name: 'string'
      };

      this.verifyParams(rule, params);
      this.body = 'passed';
    });

    request(app.listen())
    .get('/')
    .expect(422)
    .expect('Validation Failed', done);
  });

  it('should translate error message', function (done) {
    var app = koa();
    app.use(parameter(app, function() {
      var args = Array.prototype.slice.call(arguments);
      args[0] = args[0].replace('should match %s', 'doit correspondre à %s');
      return util.format.apply(util, args);
    }));
    app.use(function* () {
      var params = {
        id: 'hi im not an id',
      };
      var rule = {
        id: 'id'
      };

      this.verifyParams(rule, params);
      this.body = 'passed';
    });

    request(app.listen())
    .get('/')
    .expect(422)
    .expect({
      message: 'Validation Failed',
      errors: [{
        field: 'id',
        message: 'id doit correspondre à /^\\d+$/',
        code: 'invalid'
      }],
      params: { id: 'hi im not an id' }
    }, done);
  });
});
