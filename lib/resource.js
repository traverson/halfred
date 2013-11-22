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

Resource.prototype.link = function(key, index) {
  return elementOfPropertyArray(this._links, key, index)
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
