'use strict';

function Resource(links, curies, embedded, validationIssues) {
  var self = this
  this._links = links || {}
  initCuries(this, curies)
  this._embedded = embedded || {}
  this._validation = validationIssues || []
}

function initCuries(self, curies) {
  self._curiesMap = {}
  if (!curies) {
    self._curies = []
  } else {
    self._curies = curies
    for (var i = 0; i < self._curies.length; i++) {
      var curie = self._curies[i];
      self._curiesMap[curie.name] = curie
    }
  }
}

Resource.prototype.allLinkArrays = function() {
  return this._links
}

Resource.prototype.linkArray = function(key) {
  return propertyArray(this._links, key)
}

Resource.prototype.link = function(key, index) {
  return elementOfPropertyArray(this._links, key, index)
}

Resource.prototype.curieArray = function(key) {
  return this._curies
}

Resource.prototype.curie = function(name) {
  return this._curiesMap[name]
}

Resource.prototype.allEmbeddedResourceArrays = function () {
  return this._embedded
}

Resource.prototype.embeddedResourceArray = function(key) {
  return propertyArray(this._embedded, key)
}

Resource.prototype.embeddedResource = function(key, index) {
  return elementOfPropertyArray(this._embedded, key, index)
}

Resource.prototype.original = function() {
  return this._original
}

function propertyArray(object, key) {
  return object != null ? object[key] : null
}

function elementOfPropertyArray(object, key, index) {
  index = index || 0
  var array = propertyArray(object, key)
  if (array != null && array.length >= 1) {
    return array[index]
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
