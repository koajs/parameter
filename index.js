/*!
 * koa-parameter - index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

const Parameter = require('parameter');

module.exports = function (app, translate) {
  let parameter;

  if (typeof translate === 'function') {
    parameter = new Parameter({
      translate
    })
  } else {
    parameter = new Parameter()
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
      params = Object.assign({}, params, this.params);
    }
    const errors = parameter.validate(rules, params);
    if (!errors) {
      return;
    }
    this.throw(422, 'Validation Failed', {
      code: 'INVALID_PARAM',
      errors: errors,
      params: params
    });
  };

  return async function verifyParam(ctx, next) {
    try {
      await next();
    } catch (err) {
      if (err.code === 'INVALID_PARAM') {
        ctx.status = 422;
        ctx.body = {
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
