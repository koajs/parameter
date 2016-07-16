/*!
 * koa-parameter - index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var validate = require('parameter');

module.exports = function (app, translate) {
  if (typeof translate === 'function') {
    validate.translate = translate;
  }
  app.context.verifyParams = function(rules, params) {
    if (!rules) {
      return;
    }

    if (!params) {
      params = this.request.body
        ? this.request.body
        : this.query;

      // copy
      params = merge(params);
      params = merge(this.params, params);
    }
    var errors = validate(rules, params);
    if (!errors) {
      return;
    }
    this.throw(422, 'Validation Failed', {
      code: 'INVALID_PARAM',
      errors: errors,
      params: params
    });
  };

  return function* verifyParam(next) {
    try {
      yield* next;
    } catch (err) {
      if (err.code === 'INVALID_PARAM') {
        this.status = 422;
        this.body = {
          message: err.message,
          errors: err.errors,
          params: err.params
        };
        return;
      }
      throw err;
    }
  };
};


function merge(source, target) {
  target = target || {};
  for (var key in source) {
    target[key] = source[key];
  }
  return target;
}
