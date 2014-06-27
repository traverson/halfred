After a full build, this folder contains the browserified single-file builds that can be used in the browser in production.

* halfred.js: Standalone with UMD, not minified. Can be used by script tag or with an AMD module loader.
* halfred.min.js: Standalone with UMD, minified. Can be used by script tag or with an AMD module loader.
* halfred.external.js: Created with browserify's `--require` parameter and intended to be used (required) from other browserified modules, which were created with `--external halfred`. Not minified.
* halfred.external.min.js: Same as above, but minified.
