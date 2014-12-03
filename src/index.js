'use strict';

var bluebird = require('bluebird');

exports.register = function (server, options, next) {
  var Promise = options.Promise || bluebird;
  function injectThen (options, callback) {
    var self = this;
    return new Promise(function (resolve) {
      self.inject(options, resolve);
    })
    .then(function (response) {
      if (typeof callback === 'function') {
        callback(response);
      }
      return response;
    });
  }

  function attach (destination) {
    if (!destination.hasOwnProperty('injectThen')) {
      destination.decorate('server', 'injectThen', injectThen);
    }
  }

  attach(server);
  next();
};

exports.register.attributes = {
  multiple: true,
  pkg: require('../package.json')
};
