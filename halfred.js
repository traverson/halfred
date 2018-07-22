var Parser = require('./lib/parser');
var Resource = require('./lib/resource');
var validationFlag = false;
var logger =
  (typeof console !== 'undefined' && typeof console.warn === 'function') ?
    console : {
      log: function() {},
      debug: function() {},
      info: function() {},
      warn:  function() {},
      error: function() {}
    };

module.exports = {

  parse: function(unparsed) {
    return new Parser(logger).parse(unparsed, validationFlag);
  },

  injectLogger: function(_logger) {
    logger = _logger;
  },

  enableValidation: function(flag) {
    validationFlag = (flag != null) ? flag : true;
  },

  disableValidation: function() {
    validationFlag = false;
  },

  Resource: Resource

};
