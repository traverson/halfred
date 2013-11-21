Halfred
=======

[![Build Status](https://travis-ci.org/basti1302/halfred.png?branch=master)](https://travis-ci.org/basti1302/halfred)

[![browser support](http://ci.testling.com/basti1302/traverson.png)](http://ci.testling.com/basti1302/traverson)

[![NPM](https://nodei.co/npm/traverson.png?downloads=true&stars=true)](https://nodei.co/npm/traverson/)

A "parser" for the JSON-flavor of HAL, the Hypertext Application Language (that is `application/hal+json`). If you feed it an object that has `_links` and `_embedded` properties, as desribed in the HAL spec, it will normalize it a bit and make all links and embedded resource available via methods. If requested, Halfred can also validate a HAL object.

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

Note that `parse` might alter the object - it normalizes the `_links`.

#### Resource API

`halfred.parse(object)` returns a resource object. Here's what you can do with it:

* `allLinkArrays()`: Returns an object which has an array for each link that was present in the source object. See below why each link is represented as an array.
* `allLinks()`: Alias for `allLinkArrays`
* `linkArray(key)`: Returns the array of links for the given `key`, or `null` if there are no links for this `key`.
* `link(key)`: Returns the first element of the array of links for the given `key` or `null` if there are no links for this `key`.
* `allEmbeddedResourceArrays()`: Returns an object which has an array for each embedded resource that was present in the source object. See below why each embedded resource is represented as an array.
* `allEmbeddedArrays()`: Alias for `allEmbeddedResourceArrays()`
* `allEmbeddedResources()`: Alias for `allEmbeddedResourceArrays()`
* `embeddedResourceArray(key)`:  Returns the array of embedded resources for the given `key`, or `null` if there are no embedded resources for this `key`.
* `embeddedArray(key)`: Alias for `embeddedResourceArray()`.
* `embeddedResource(key)`: Returns the first element of the array of embedded resources for the given `key` or `null` if there are no embedded resources for this `key`.
* `embedded(key)`: Alias for `embeddedResource(key)`
* `validationIssues()`: Returns all validation issues.
* `validation()`: Alias for `validationIssues()`

#### Links And Embedded Resources

The resource methods `allLinkArrays()` and `linkArray(key)` an array for each link, instead of a single object. This might seem counterintuitive. The HAL spec allows a link to be either a single link object or an array of link objects, so halfred normalizes all that are not arrays to be single element arrays. If you are sure that there is only one link for a given key, you can use `link(key)` to directly get the first element from that array.

The same is true for embedded resources.

Once you have the link object, you can access the properties `href`, `templated` and so on (refer to the spec for details) on it. The `templated` property defaults to false, if it wasn't set in the object given to `parse`, all other properties described in the spec default to `null`.

#### Enable/Disable Validation

In some situations, it might be desirable to validate the resource you want to parse and check, if it is valid according to the HAL spec. However, in most situations you might not want to do this but just get the links and the embedded resources. If you are the client of a HAL API and want to adhere to [Postel's law](http://en.wikipedia.org/wiki/Robustness_principle) (especially the _"be liberal in what you accept"_ part), it is rather the latter than the former. Therefore, by default, Halfred does not enforce strict validation checks. If you want to have validation checks you can enable them by calling `halfred.enableValidation()`. You can disable them again by calling, guess what, `halfred.disableValidation()`.

License
-------

MIT
