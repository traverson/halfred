'use strict';

exports.get = function() {
  return {
    _links: {
      notSelf: {
        href: '/no/self/link',
        description: 'self link is not required by the spec'
      },
      first: {
        description: 'this link has no href'
      },
      second: {
        href: '/href',
        type: [ 'an attribue might not be a string, but do I care?' ]
      },
      third: {
        href: 'href',
        type: null,
        description: 'this one has a null-attribute'
      },
      'uri-template-1': {
        href: '/a{/template}/whichs/templated/property/{isnt}/set'
      },
      'uri-template-2': {
        href: '/a{/template}/whichs/templated/property/{is}/set/to/false',
        templated: false
      },
      'uri-template-3': {
        href: '/a{/template}/whichs/templated/property/{is}/not/a/boolean',
        templated: 5
      }
    },
    _embedded: {
      one: {
        this: 'resource has no _links, therefore it also has no self-link'
      },
      two: {
        _links: {
          self: { href: 'not an URI at all' }
        }
      }
    }
  };
};
