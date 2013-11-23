Halfred
=======

[![Build Status](https://travis-ci.org/basti1302/halfred.png?branch=master)](https://travis-ci.org/basti1302/halfred)

[![browser support](http://ci.testling.com/basti1302/halfred.png)](http://ci.testling.com/basti1302/halfred)

[![NPM](https://nodei.co/npm/halfred.png?downloads=true&stars=true)](https://nodei.co/npm/halfred/)

A "parser" for the JSON-flavour of HAL, the Hypertext Application Language (that is `application/hal+json`). If you feed it an object that has `_links` and `_embedded` properties, as desribed in the HAL spec, it will make all links and embedded resource available via convenient methods. If requested, Halfred can also validate a HAL object.

For more information on HAL, see
* [the formal spec](http://tools.ietf.org/html/draft-kelly-json-hal)
* [a less formal introduction](http://stateless.co/hal_specification.html)

This module works in Node.js and in the browser. It has no dependencies, the size of the browser build is 8 KB / 4 KB (non-minified/minified)

Installation
------------

### Node.js

npm:

    npm install halfred --save

### Browser

Download and use one of the following:

* [Minified build with UMD](https://raw.github.com/basti1302/halfred/master/browser/dist/halfred.min.js): This build can be used with an AMD loader like RequireJS or with a script tag (in which case it will register `halfred` in the global scope). **If in doubt, use this build.**
* [Non-minified build with UMD](https://raw.github.com/basti1302/halfred/master/browser/dist/halfred.js): Same as above, just larger :-)
* If your project uses browserify, you don't need to do anything. Just `npm install halfred --save` and `require('halfred')`, then browserify your module as usual.
* [Minified require/external build](https://raw.github.com/basti1302/halfred/master/browser/dist/halfred.external.min.js): Created with browserify's `--require` parameter and intended to be used (required) from other browserified modules, which were created with `--external halfred`. This build could be used if you use browserify but do not want to bundle Halfred with your own browserify build but keep it as a separate file.
* [Non-minified require/external build](https://raw.github.com/basti1302/halfred/master/browser/dist/halfred.external.js): Same as before, just bigger.

### Usage

    var halfred = require('halfred');
    var resource = halfred.parse(object);

#### Resource API

`halfred.parse(object)` returns a resource object. Here's what you can do with it:

* `allLinkArrays()`: Returns an object which has an array for each link that was present in the source object. See below why each link is represented as an array.
* `allLinks()`: Alias for `allLinkArrays`
* `linkArray(key)`: Returns the array of links for the given `key`, or `null` if there are no links for this `key`.
* `link(key)`: Returns the first element of the array of links for the given `key` or `null` if there are no links for this `key`.
* `allEmbeddedResourceArrays()`: Returns an object which has an array for each embedded resource that was present in the source object. See below why each embedded resource is represented as an array. Each element of any of this arrays is in turn a `Resource` object.
* `allEmbeddedArrays()`: Alias for `allEmbeddedResourceArrays()`
* `allEmbeddedResources()`: Alias for `allEmbeddedResourceArrays()`
* `embeddedResourceArray(key)`:  Returns the array of embedded resources for the given `key`, or `null` if there are no embedded resources for this `key`. Each element of this arrays is in turn a `Resource` object.
* `embeddedArray(key)`: Alias for `embeddedResourceArray()`.
* `embeddedResource(key)`: Returns the first element of the array of embedded resources for the given `key` or `null` if there are no embedded resources for this `key`. The returend object is a `Resource` object.
* `embedded(key)`: Alias for `embeddedResource(key)`
* `original()`: Returns the unmodified, original object that was parsed to this resource. This is rather uninteresting for the source object you give to the `parse` method (because you probably still have a reference to the source object) but it is a convenient way to get the part of the source object that corresponds to an embedded resource.
* `validationIssues()`: Returns all validation issues. Validation issues are only gathered if validation has been turned on by calling `halfred.enableValidation()` before calling `halfred.parse`.
* `validation()`: Alias for `validationIssues()`

In addition to the methods mentioned here, `resource` has all properties of the source object. This is also true for embedded resource objects. The non-HAL properties (that is, any property except `_links` and `_embedded`) are copied over to the Resource object. This is always a shallow copy, so modifying the a non-HAL property in the Resource object might also alter the source object and vice versa.

The Resource object also has the properties `_links` and `_embedded` but they might differ from the `_links`/`_embedded` properties in the source object (Halfred applies some normalization to them). These are not intended to be accessed by clients directly, instead, use the provided methods to work with links and embedded resources.

#### Links And Embedded Resources

The resource methods `allLinkArrays()` and `linkArray(key)` an array for each link, instead of a single object. This might seem counterintuitive. The HAL spec allows a link to be either a single link object or an array of link objects, so halfred normalizes all that are not arrays to be single element arrays. If you are sure that there is only one link for a given key, you can use `link(key)` to directly get the first element from that array.

The same is true for embedded resources.

Once you have the link object, you can access the properties `href`, `templated` and so on (refer to the [spec](http://tools.ietf.org/html/draft-kelly-json-hal) for details) on it. The `templated` property defaults to false, if it wasn't set in the object given to `parse`, all other properties described in the spec default to `null`.

#### Enable/Disable Validation

In some situations, it might be desirable to validate the resource you want to parse and check, if it is valid according to the HAL spec. By default, Halfred does not do validation checks. If you want to have validation checks you can enable them by calling `halfred.enableValidation()`. Then after parsing a source object, call `validationIssues()` on the resource object returned by `parse` to get an array of all validation issues.

 You can disable validation checks again by calling `halfred.disableValidation()`.You can also call `halfred.enableValidation(true)` or `halfred.enableValidation(false)` to enable/disable validation.

Release Notes
-------------

* 0.2.0 2013-11-22: Make the source object of a parsed resource available (useful for embedded resources)
* 0.1.1 2013-11-21: Leave source object untouched while parsing
* 0.1.0 2013-11-21: Initial release

License
-------

MIT
