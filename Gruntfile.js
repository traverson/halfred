'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        '**/*.js',
        'Gruntfile.js',
        '!node_modules/**/*',
        '!browser/dist/**/*',
        '!browser/example/assets/*.js',
        '!browser/test/browserified_tests.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    // remove all previous browserified builds
    clean: {
      dist: ['./browser/dist/**/*.js'],
      tests: ['./browser/test/browserified_tests.js']
    },

    // browserify the module
    browserify: {
      // This browserify build be used by users of the module. It contains a
      // UMD (universal module definition) and can be used via an AMD module
      // loader like RequireJS or by simply placing a script tag in the page,
      // which registers the module as a global var.
      standalone: {
        src: [ '<%= pkg.name %>.js' ],
        dest: './browser/dist/<%= pkg.name %>.js',
        options: {
          browserifyOptions: {
            standalone: '<%= pkg.name %>'
          }
        }
      },
      // This browserify build can be required by other browserify modules that
      // have been created with an --external parameter.
      external: {
        src: [ '<%= pkg.name %>.js' ],
        dest: './browser/dist/<%= pkg.name %>.external.js',
        options: {
          alias: [ './halfred.js:halfred' ]
        }
      },
      // Browserified tests.
      tests: {
        src: [ 'test/browser_suite.js' ],
        dest: './browser/test/browserified_tests.js',
        options: {
          external: [ './halfred.js:halfred' ],
          browserifyOptions: {
            // Embed source map for tests
            debug: true,
          }
        }
      }
    },

    // Uglify browser libs
    uglify: {
      dist: {
        files: {
          'browser/dist/<%= pkg.name %>.min.js':
              ['<%= browserify.standalone.dest %>'],
          'browser/dist/<%= pkg.name %>.external.min.js':
              ['<%= browserify.external.dest %>']
        }
      }
    },

    // run the mocha tests in PhantomJS
    mocha: {
      test: {
        src: [ 'browser/test/index.html' ],
        options: {
          timeout: 20000,
          reporter: 'spec',
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>', '**/*.json'],
      tasks: ['default']
    },
  });

  // load all grunt-tasks
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'jshint',
    'mochaTest',
    'clean',
    'browserify',
    'uglify',
    'mocha',
  ]);
};
