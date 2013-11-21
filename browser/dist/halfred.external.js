require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"7fyf1i":[function(require,module,exports){
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

},{"./lib/parser":4}],"/home/bastian/projekte/halfred/halfred.js":[function(require,module,exports){
module.exports=require('7fyf1i');
},{}],3:[function(require,module,exports){
'use strict';

function ImmutableStack() {
  if (arguments.length >= 1) {
    this._array = arguments[0]
  } else {
    this._array = []
  }
}

ImmutableStack.prototype.array = function() {
  return this._array
}

ImmutableStack.prototype.isEmpty = function(array) {
  return this._array.length === 0
}

ImmutableStack.prototype.push = function(element) {
  var array = this._array.slice(0)
  array.push(element)
  return new ImmutableStack(array)
}

ImmutableStack.prototype.pop = function() {
  var array = this._array.slice(0, this._array.length - 1)
  return new ImmutableStack(array)
}

ImmutableStack.prototype.peek = function() {
  if (this.isEmpty()) {
    throw new Error('can\'t peek on empty stack')
  }
  return this._array[this._array.length - 1]
}

module.exports = ImmutableStack

},{}],4:[function(require,module,exports){
'use strict';

var Resource = require('./resource')
var Stack = require('./immutable_stack')

var linkSpec = {
  href: { required: true, defaultValue: null },
  templated: { required: false, defaultValue: false },
  type: { required: false, defaultValue: null },
  deprecation: { required: false, defaultValue: null },
  name: { required: false, defaultValue: null },
  profile: { required: false, defaultValue: null },
  title: { required: false, defaultValue: null },
  hreflang: { required: false, defaultValue: null }
}

function Parser() {
}

Parser.prototype.parse = function parse(unparsed, validationFlag) {
  var validation = validationFlag ? [] : null
  return _parse(unparsed, validation, new Stack())
}

function _parse(unparsed, validation, path) {
  if (unparsed == null) {
    return unparsed
  }
  var links = parseLinks(unparsed._links, validation, path.push('_links'))
  var embedded = parseEmbeddedResourcess(unparsed._embedded, validation,
      path.push('_embedded'))
  var resource = new Resource(links, embedded, validation)
  copyNonHalProperties(unparsed, resource)
  return resource
}

function parseLinks(links, validation, path) {
  links = parseHalProperty(links, parseLink, validation, path)
  if (links == null || links.self == null) {
    // No links at all? Then it implictly misses the self link which it SHOULD
    // have according to spec
    reportValidationIssue('Resource does not have a self link', validation,
        path)
  }
  return links
}

function parseEmbeddedResourcess(embedded, parentValidation, path) {
  embedded = parseHalProperty(embedded, identity, parentValidation, path)
  if (embedded == null) {
    return embedded
  }
  Object.keys(embedded).forEach(function(key) {
    embedded[key] = embedded[key].map(function(embeddedElement) {
      var childValidation = parentValidation != null ? [] : null
      return _parse(embeddedElement, childValidation, path.push(key))
    })
  })
  return embedded
}

/*
 * Copy over non-hal properties (everything that is not _links or _embedded)
 * to the parsed resource.
 */
function copyNonHalProperties(unparsed, resource) {
  Object.keys(unparsed).forEach(function(key) {
    if (key !== '_links' && key !== '_embedded') {
      resource[key] = unparsed[key]
    }
  })
}

/*
 * Processes one of the two main hal properties, that is _links or _embedded.
 * Each sub-property is turned into a single element array if it isn't already
 * an array. processingFunction is applied to each array element.
 */
function parseHalProperty(property, processingFunction, validation, path) {
  if (property == null) {
    return property
  }

  var copy = {}

  Object.keys(property).forEach(function(key) {
    copy[key] = arrayfy(key, property[key], processingFunction,
      validation, path)
  })
  return copy
}

function arrayfy(key, object, fn, validation, path) {
  if (isArray(object)) {
    return object.map(function(element) {
      return fn(key, element, validation, path)
    })
  } else {
    return [fn(key, object, validation, path)]
  }
}

function parseLink(linkKey, link, validation, path) {
  // add missing properties mandated by spec and do generic validation
  Object.keys(linkSpec).forEach(function(key) {
    if (link[key] == null) {
      if (linkSpec[key].required) {
        reportValidationIssue('Link misses required property ' + key + '.',
            validation, path.push(linkKey))
      }
      if (linkSpec[key].defaultValue != null) {
        link[key] = linkSpec[key].defaultValue
      }
    }
  })

  // check more inter-property relations mandated by spec
  if (link.deprecation) {
    log('Warning: Link ' + pathToString(path.push(linkKey)) +
        ' is deprecated, see ' + link.deprecation)
  }
  if (link.templated !== true && link.templated !== false) {
    link.templated = false
  }

  if (!validation) {
    return link
  }
  if (link.href && link.href.indexOf('{') >= 0 && !link.templated) {
    reportValidationIssue('Link seems to be an URI template ' +
        'but its "templated" property is not set to true.', validation,
        path.push(linkKey))
  }
  return link
}

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

function identity(key, object) {
  return object
}

function reportValidationIssue(message, validation, path) {
  if (validation) {
    validation.push({
      path: pathToString(path),
      message: message
    })
  }
}

// TODO fix this ad hoc mess - does ie support console.log as of ie9?
function log(message) {
  if (typeof console !== 'undefined' && typeof console.log === 'function') {
    console.log(message)
  }
}

function pathToString(path) {
  var s = '$.'
  for (var i = 0; i < path.array().length; i++) {
    s += path.array()[i] + '.'
  }
  s = s.substring(0, s.length - 1)
  return s
}

module.exports = Parser

},{"./immutable_stack":3,"./resource":5}],5:[function(require,module,exports){
'use strict';

function Resource(links, embedded, validationIssues) {
  var self = this
  this._links = links || {}
  this._embedded = embedded || {}
  this._validation = validationIssues || []

}

Resource.prototype.allLinkArrays = function() {
  return this._links
}

Resource.prototype.linkArray = function(key) {
  return propertyArray(this._links, key)
}

Resource.prototype.link = function(key) {
  return firstElementOfProperty(this._links, key)
}

Resource.prototype.allEmbeddedResourceArrays = function () {
  return this._embedded
}

Resource.prototype.embeddedResourceArray = function(key) {
  return propertyArray(this._embedded, key)
}

Resource.prototype.embeddedResource = function(key) {
  return firstElementOfProperty(this._embedded, key)
}

function propertyArray(object, key) {
  return object != null ? object[key] : null
}

function firstElementOfProperty(object, key) {
  var array = propertyArray(object, key)
  if (array != null && array.length >= 1) {
    return array[0]
  }
  return null
}


Resource.prototype.validationIssues = function() {
  return this._validation
}

// alias definitions
Resource.prototype.allLinks = Resource.prototype.allLinkArrays
Resource.prototype.allEmbeddedArrays =
    Resource.prototype.allEmbeddedResources =
    Resource.prototype.allEmbeddedResourceArrays
Resource.prototype.embeddedArray = Resource.prototype.embeddedResourceArray
Resource.prototype.embedded = Resource.prototype.embeddedResource
Resource.prototype.validation = Resource.prototype.validationIssues

module.exports = Resource

},{}]},{},["7fyf1i"])
;