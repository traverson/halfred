var Parser = require('./lib/parser')

var validationFlag = false

module.exports = {

  parse: function(unparsed) {
    return new Parser().parse(unparsed, validationFlag)
  },

  enableValidation: function(flag) {
    validationFlag = (flag != null) ? flag : true
  },

  disableValidation: function() {
    validationFlag = false
  }
}
